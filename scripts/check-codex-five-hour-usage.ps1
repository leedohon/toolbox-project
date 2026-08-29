[CmdletBinding()]
param(
    [ValidateRange(1, 100)]
    [int]$MinimumRemainingPercent = 20,

    [ValidateRange(5, 120)]
    [int]$TimeoutSeconds = 30
)

$ErrorActionPreference = 'Stop'
$process = $null

function Write-GuardResult {
    param(
        [string]$Status,
        [Nullable[int]]$UsedPercent = $null,
        [Nullable[int]]$RemainingPercent = $null,
        [Nullable[long]]$ResetsAt = $null,
        [string]$Reason = $null
    )

    [ordered]@{
        status = $Status
        windowDurationMins = 300
        minimumRemainingPercent = $MinimumRemainingPercent
        usedPercent = $UsedPercent
        remainingPercent = $RemainingPercent
        resetsAt = $ResetsAt
        reason = $Reason
    } | ConvertTo-Json -Compress
}

function Read-ProtocolResponse {
    param(
        [System.Diagnostics.Process]$Process,
        [int]$ExpectedId,
        [datetime]$Deadline
    )

    while ([datetime]::UtcNow -lt $Deadline) {
        $remainingMilliseconds = [Math]::Max(
            1,
            [int]($Deadline - [datetime]::UtcNow).TotalMilliseconds
        )
        $lineTask = $Process.StandardOutput.ReadLineAsync()
        if (-not $lineTask.Wait($remainingMilliseconds)) {
            throw "Timed out waiting for Codex app-server response $ExpectedId."
        }

        $line = $lineTask.Result
        if ($null -eq $line) {
            throw 'Codex app-server closed before returning the usage snapshot.'
        }

        try {
            $message = $line | ConvertFrom-Json
        }
        catch {
            continue
        }

        if ($message.id -eq $ExpectedId) {
            return $message
        }
    }

    throw "Timed out waiting for Codex app-server response $ExpectedId."
}

try {
    $codexCommand = Get-Command codex -ErrorAction Stop
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = $codexCommand.Source
    # Windows PowerShell 5.1 does not expose ProcessStartInfo.ArgumentList.
    $startInfo.Arguments = 'app-server --stdio'
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardInput = $true
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true

    $process = [System.Diagnostics.Process]::new()
    $process.StartInfo = $startInfo
    if (-not $process.Start()) {
        throw 'Unable to start Codex app-server.'
    }

    $deadline = [datetime]::UtcNow.AddSeconds($TimeoutSeconds)
    $initialize = @{
        id = 1
        method = 'initialize'
        params = @{
            clientInfo = @{
                name = 'toolbox-usage-guard'
                title = 'Toolbox Usage Guard'
                version = '1.0.0'
            }
        }
    } | ConvertTo-Json -Compress -Depth 10
    $process.StandardInput.WriteLine($initialize)
    $process.StandardInput.Flush()

    $initializeResponse = Read-ProtocolResponse -Process $process -ExpectedId 1 -Deadline $deadline
    if ($initializeResponse.error) {
        throw $initializeResponse.error.message
    }

    $process.StandardInput.WriteLine('{"method":"initialized","params":{}}')
    $process.StandardInput.WriteLine('{"id":2,"method":"account/rateLimits/read","params":{}}')
    $process.StandardInput.Flush()

    $usageResponse = Read-ProtocolResponse -Process $process -ExpectedId 2 -Deadline $deadline
    if ($usageResponse.error) {
        throw $usageResponse.error.message
    }

    $snapshots = [System.Collections.Generic.List[object]]::new()
    if ($usageResponse.result.rateLimits) {
        $snapshots.Add($usageResponse.result.rateLimits)
    }
    if ($usageResponse.result.rateLimitsByLimitId) {
        foreach ($property in $usageResponse.result.rateLimitsByLimitId.PSObject.Properties) {
            if ($property.Value) {
                $snapshots.Add($property.Value)
            }
        }
    }

    $fiveHourWindows = foreach ($snapshot in $snapshots) {
        foreach ($windowName in @('primary', 'secondary')) {
            $window = $snapshot.$windowName
            if ($window -and $window.windowDurationMins -eq 300) {
                $window
            }
        }
    }

    if (-not $fiveHourWindows) {
        Write-GuardResult -Status 'unavailable' -Reason 'No authenticated 300-minute rate-limit window was returned.'
        exit 0
    }

    $selectedWindow = $fiveHourWindows | Sort-Object usedPercent -Descending | Select-Object -First 1
    $usedPercent = [Math]::Min(100, [Math]::Max(0, [int]$selectedWindow.usedPercent))
    $remainingPercent = 100 - $usedPercent
    $resetsAt = if ($null -ne $selectedWindow.resetsAt) { [long]$selectedWindow.resetsAt } else { $null }

    if ($remainingPercent -lt $MinimumRemainingPercent) {
        Write-GuardResult -Status 'below_threshold' -UsedPercent $usedPercent -RemainingPercent $remainingPercent -ResetsAt $resetsAt -Reason 'The five-hour remaining allowance is below the configured threshold.'
        exit 0
    }

    Write-GuardResult -Status 'eligible' -UsedPercent $usedPercent -RemainingPercent $remainingPercent -ResetsAt $resetsAt
    exit 0
}
catch {
    Write-GuardResult -Status 'unavailable' -Reason $_.Exception.Message
    exit 0
}
finally {
    if ($process -and -not $process.HasExited) {
        try {
            $process.StandardInput.Close()
            if (-not $process.WaitForExit(1000)) {
                $process.Kill()
            }
        }
        catch {
            # The guard has already emitted a fail-closed result.
        }
    }
    if ($process) {
        $process.Dispose()
    }
}
