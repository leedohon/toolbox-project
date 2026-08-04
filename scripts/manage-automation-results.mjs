import {mkdir, readdir, readFile, rename, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resultsRoot = path.join(repositoryRoot, 'toolbox', 'automation-results');
const checkedRoot = path.join(resultsRoot, 'checked');
const uncheckedRoot = path.join(resultsRoot, 'unchecked');
const efficiencyLog = path.join(repositoryRoot, 'toolbox', 'quality', 'development-token-efficiency.json');
const hardPlanPath = path.join(repositoryRoot, 'toolbox', 'automation', 'workflows', 'hard.json');
const measurementStatuses = new Set(['measured', 'proxy_only', 'unavailable']);

function requiresDevelopmentEfficiency(policyVersion) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(policyVersion || ''));
  if (!match) return false;
  const [, major, minor] = match.map(Number);
  return major > 0 || minor >= 3;
}

function requiresAdaptiveHardEvidence(policyVersion) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(policyVersion || ''));
  if (!match) return false;
  const [, major, minor] = match.map(Number);
  return major > 0 || minor >= 6;
}

async function ensureFolders() {
  await Promise.all([
    mkdir(checkedRoot, {recursive: true}),
    mkdir(uncheckedRoot, {recursive: true})
  ]);
}

async function jsonFiles(directory) {
  return (await readdir(directory, {withFileTypes: true}))
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => entry.name)
    .sort();
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function kstTimestamp(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+09:00`;
}

async function listUnchecked() {
  const records = [];
  for (const name of await jsonFiles(uncheckedRoot)) {
    const value = await readJson(path.join(uncheckedRoot, name));
    records.push({
      runId: value.runId,
      workflow: value.workflow,
      status: value.status,
      summary: value.summary,
      bloggerStatus: value.blogger?.status ?? null,
      pushed: value.git?.pushed ?? false,
      deploymentStatus: value.deployment?.status ?? null,
      blocked: value.blocked ?? []
    });
  }
  process.stdout.write(`${JSON.stringify(records, null, 2)}\n`);
}

function compactRecord(value) {
  return {
    runId: value.runId,
    workflow: value.workflow,
    status: value.status,
    summary: value.summary,
    bloggerStatus: value.blogger?.status ?? null,
    pushed: value.git?.pushed ?? false,
    deploymentStatus: value.deployment?.status ?? null,
    blocked: value.blocked ?? []
  };
}

async function reportUnchecked() {
  const reportedAt = kstTimestamp();
  const records = [];
  for (const name of await jsonFiles(uncheckedRoot)) {
    const file = path.join(uncheckedRoot, name);
    const value = await readJson(file);
    value.reportHistory = Array.isArray(value.reportHistory) ? value.reportHistory : [];
    value.reportHistory.push({
      at: reportedAt,
      action: 'reported',
      note: '새 자동 워크플로 시작 전 미확인 기록으로 요약 보고'
    });
    await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    records.push(compactRecord(value));
  }
  process.stdout.write(`${JSON.stringify({reportedAt, count: records.length, records}, null, 2)}\n`);
}

async function migrate() {
  const rootEntries = await readdir(resultsRoot, {withFileTypes: true});
  let moved = 0;
  for (const entry of rootEntries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const source = path.join(resultsRoot, entry.name);
    const value = await readJson(source);
    const destinationRoot = value.confirm === 'Y' ? checkedRoot : uncheckedRoot;
    await rename(source, path.join(destinationRoot, entry.name));
    moved += 1;
  }
  process.stdout.write(`Migrated ${moved} result file(s).\n`);
}

async function confirm(runId) {
  if (!/^\d{8}-\d{6}-(daily-light|hard|all-in|create)$/.test(runId)) {
    throw new Error('Use a valid automation run ID.');
  }
  const name = `${runId}.json`;
  const source = path.join(uncheckedRoot, name);
  const destination = path.join(checkedRoot, name);
  const value = await readJson(source);
  if (value.runId !== runId) throw new Error(`Run ID mismatch in ${name}.`);

  const confirmedAt = kstTimestamp();
  value.confirm = 'Y';
  value.confirmedAt = confirmedAt;
  const stage = value.runState?.stages?.confirm;
  if (stage) {
    stage.status = 'completed';
    stage.startedAt = confirmedAt;
    stage.completedAt = confirmedAt;
    stage.evidence = [...new Set([...(stage.evidence ?? []), '사용자 확인 완료'])];
    stage.blockCode = null;
    value.runState.current = 'confirm';
  }

  await writeFile(source, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(source, destination);
  process.stdout.write(`Confirmed and moved ${runId}.\n`);
}

async function validate() {
  const errors = [];
  const hardPlan = await readJson(hardPlanPath);
  let efficiency;
  try {
    efficiency = await readJson(efficiencyLog);
    if (!Array.isArray(efficiency.records)) errors.push('Development token efficiency log has no records array.');
    else {
      const runIds = new Set();
      for (const record of efficiency.records) {
        if (!record.runId || runIds.has(record.runId)) errors.push(`Invalid or duplicate efficiency runId: ${record.runId ?? 'missing'}`);
        runIds.add(record.runId);
        if (!measurementStatuses.has(record.measurementStatus)) errors.push(`${record.runId}: invalid measurementStatus.`);
        if (record.measurementStatus === 'measured') {
          if (!(record.tokens?.baseline > 0) || !(record.tokens?.current >= 0) || typeof record.overallReduction !== 'number') errors.push(`${record.runId}: measured record requires comparable token totals and overallReduction.`);
        } else if (record.overallReduction !== null) errors.push(`${record.runId}: proxy-only or unavailable record must keep overallReduction null.`);
      }
    }
  } catch (error) {
    errors.push(`Development token efficiency log: ${error.message}`);
  }
  const rootJson = (await readdir(resultsRoot, {withFileTypes: true}))
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'));
  if (rootJson.length) errors.push(`Result root contains JSON files: ${rootJson.map(entry => entry.name).join(', ')}`);

  const seen = new Set();
  for (const [directory, expectedConfirm] of [[checkedRoot, 'Y'], [uncheckedRoot, 'N']]) {
    for (const name of await jsonFiles(directory)) {
      try {
        const value = await readJson(path.join(directory, name));
        if (seen.has(name)) errors.push(`Duplicate result filename: ${name}`);
        seen.add(name);
        if (`${value.runId}.json` !== name) errors.push(`Run ID and filename differ: ${name}`);
        if (value.confirm !== expectedConfirm) errors.push(`${name} has confirm ${value.confirm}; expected ${expectedConfirm}.`);
        if (expectedConfirm === 'Y' && !value.confirmedAt) errors.push(`${name} is checked without confirmedAt.`);
        if (expectedConfirm === 'N' && value.confirmedAt) errors.push(`${name} is unchecked with confirmedAt.`);
        if (requiresDevelopmentEfficiency(value.knowledgeOptimization?.policyVersion) && !value.developmentTokenEfficiency) errors.push(`${name} uses token-tracking policy without developmentTokenEfficiency.`);
        if (value.workflow === 'hard' && value.status === 'completed') {
          if (!value.git?.commit) errors.push(`${name}: completed hard workflow requires its own commit.`);
          if (value.git?.pushed !== true) errors.push(`${name}: completed hard workflow requires a successful push.`);
          if (value.deployment?.status !== 'completed') errors.push(`${name}: completed hard workflow requires a completed public deployment.`);
          if (requiresAdaptiveHardEvidence(value.knowledgeOptimization?.policyVersion)) {
            for (const key of ['improvements', 'newOrMerge', 'commonFixes']) {
              if (!(value.workCounts?.[key] >= hardPlan.pageWork[key])) errors.push(`${name}: completed hard workflow needs ${key} evidence count of at least ${hardPlan.pageWork[key]}.`);
            }
            if ((value.selectedTools?.length ?? 0) < hardPlan.pageWork.improvements) errors.push(`${name}: improvement evidence must cover at least ${hardPlan.pageWork.improvements} selected tools.`);
            if ((value.changes?.length ?? 0) < hardPlan.pageWork.improvements) errors.push(`${name}: improvement evidence list is shorter than the hard plan.`);
            if ((value.newIdeas?.length ?? 0) < hardPlan.pageWork.newOrMerge) errors.push(`${name}: implemented new-or-merge evidence list is shorter than the hard plan.`);
            if ((value.commonModules?.length ?? 0) < hardPlan.pageWork.commonFixes) errors.push(`${name}: common-fix evidence list is shorter than the hard plan.`);
          }
        }
        if (value.developmentTokenEfficiency) {
          const item = value.developmentTokenEfficiency;
          if (!measurementStatuses.has(item.measurementStatus)) errors.push(`${name} has invalid development token measurementStatus.`);
          if (item.measurementStatus === 'measured' && (!(item.tokens?.baseline > 0) || !(item.tokens?.current >= 0) || typeof item.overallReduction !== 'number')) errors.push(`${name} measured tokens are incomplete.`);
          if (item.measurementStatus !== 'measured' && item.overallReduction !== null) errors.push(`${name} must not claim overallReduction without measured tokens.`);
          if (!efficiency?.records?.some(record => record.runId === value.runId)) errors.push(`${name} has no matching global development token efficiency record.`);
        }
      } catch (error) {
        errors.push(`${name}: ${error.message}`);
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  process.stdout.write(`Validated ${seen.size} result file(s).\n`);
}

await ensureFolders();
const [command = 'list', argument] = process.argv.slice(2);
if (command === 'list') await listUnchecked();
else if (command === 'report') await reportUnchecked();
else if (command === 'migrate') await migrate();
else if (command === 'confirm') await confirm(argument ?? '');
else if (command === 'validate') await validate();
else throw new Error('Usage: node scripts/manage-automation-results.mjs <list|report|migrate|confirm RUN_ID|validate>');
