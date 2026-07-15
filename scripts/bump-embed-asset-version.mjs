import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [asset, fromVersion, toVersion] = process.argv.slice(2);
if (!asset || !fromVersion || !toVersion) throw new Error('Usage: node scripts/bump-embed-asset-version.mjs <asset> <from> <to>');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const embed = path.join(root, 'embed');
const files = [];
async function collect(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(target);
    else if (/\.(?:html|js)$/.test(entry.name)) files.push(target);
  }
}
await collect(embed);
let updated = 0;
const before = `${asset}?v=${fromVersion}`;
const after = `${asset}?v=${toVersion}`;
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  const next = source.replaceAll(before, after);
  if (next === source) continue;
  await fs.writeFile(file, next);
  updated += 1;
}
console.log(`Updated ${updated} embed files: ${before} -> ${after}`);
