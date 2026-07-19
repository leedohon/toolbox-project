import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = process.argv[2];
if (!configPath) throw new Error('Usage: node scripts/run-create-config.mjs <config.json>');
const config = JSON.parse(fs.readFileSync(path.resolve(root, configPath), 'utf8'));
const slugs = config.tools.map((tool) => tool.slug);
const run = (script, args = []) => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${script} failed with exit code ${result.status}`);
};

run('scaffold-tool-releases.mjs', [configPath]);
run('build-tool-posts.mjs', slugs);
run('build-tool-catalog.mjs');
run('build-ai-index.mjs');
run('validate-tool-releases.mjs');
run('validate-tool-modules.mjs');
console.log(`Completed create config for ${slugs.length} tools.`);
