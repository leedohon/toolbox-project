import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runId = process.argv[process.argv.indexOf('--from-run') + 1];

if (!runId || runId.startsWith('--')) {
  throw new Error('Usage: node scripts/create-tool-releases-from-run.mjs --from-run <runId>');
}

async function findResult() {
  for (const state of ['unchecked', 'checked']) {
    const candidate = path.join(root, 'toolbox', 'automation-results', state, `${runId}.json`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error(`Workflow result not found: ${runId}`);
}

const result = JSON.parse(await fs.readFile(await findResult(), 'utf8'));
const tools = result.selectedTools || [];
const plans = result.releasePlans || {};
if (!tools.length) throw new Error(`${runId}: selectedTools is empty`);

for (const tool of tools) {
  const plan = plans[tool];
  if (!plan || !['minimum', 'minor', 'major'].includes(plan.level) || !plan.summary || !Array.isArray(plan.changes) || !plan.changes.length) {
    throw new Error(`${runId}: incomplete release plan for ${tool}`);
  }
}

const releaseScript = path.join(root, 'scripts', 'create-tool-release.mjs');
for (const tool of tools) {
  const plan = plans[tool];
  const args = [releaseScript, tool, plan.level, '--summary', plan.summary, ...plan.changes.flatMap((change) => ['--change', change]), '--dry-run'];
  const { stdout } = await run(process.execPath, args, { cwd: root });
  process.stdout.write(stdout);
}
for (const tool of tools) {
  const plan = plans[tool];
  const args = [releaseScript, tool, plan.level, '--summary', plan.summary, ...plan.changes.flatMap((change) => ['--change', change])];
  const { stdout } = await run(process.execPath, args, { cwd: root });
  process.stdout.write(stdout);
}
