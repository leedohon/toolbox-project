import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
let files = args;
const fromRunIndex = args.indexOf('--from-run');
if (fromRunIndex >= 0) {
  const runId = args[fromRunIndex + 1];
  if (!runId) throw new Error('Usage: node scripts/validate-inline-scripts.mjs --from-run RUN_ID');
  let run = null;
  for (const bucket of ['unchecked', 'checked']) {
    try { run = JSON.parse(await fs.readFile(path.join(root, 'toolbox', 'automation-results', bucket, `${runId}.json`), 'utf8')); break; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!run) throw new Error(`Automation result not found: ${runId}`);
  files = (run.selectedTools || []).map((tool) => path.join(root, 'toolbox', 'posts', `${tool}.html`));
}
if (!files.length) throw new Error('Usage: node scripts/validate-inline-scripts.mjs <html...>');

for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [, attributes, source] of scripts) {
    const parsable = /\btype=["']module["']/.test(attributes)
      ? source.replace(/^\s*import\s+[^;]+;/gm, '')
      : source;
    if (/\btype=["']module["']/.test(attributes)) Function(`return (async () => {${parsable}\n});`);
    else Function(parsable);
  }
  console.log(`${file}: ${scripts.length} inline scripts parsed`);
}
