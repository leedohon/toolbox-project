import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const files = [];
const fromRunIndex = args.indexOf('--from-run');

if (fromRunIndex >= 0) {
  const runId = args[fromRunIndex + 1];
  if (!runId) throw new Error('Usage: node scripts/validate-es-module-syntax.mjs --from-run RUN_ID');
  let result;
  for (const bucket of ['unchecked', 'checked']) {
    try {
      result = JSON.parse(await fs.readFile(path.join(root, 'toolbox', 'automation-results', bucket, `${runId}.json`), 'utf8'));
      break;
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!result?.selectedTools?.length) throw new Error(`Automation result or selectedTools not found: ${runId}`);
  for (const tool of result.selectedTools) {
    const target = path.join(root, 'embed', tool, 'tool.js');
    try { await fs.access(target); files.push(target); } catch {}
  }
} else {
  for (const value of args) files.push(path.resolve(root, value));
}

if (!files.length) throw new Error('No ES module files were selected.');
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  const check = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
  if (check.status !== 0) throw new Error(`${path.relative(root, file)}\n${check.stderr.trim()}`);
}
console.log(`Validated ES module syntax in ${files.length} files.`);
