import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const separator = args.indexOf('--qa');
if (separator < 1) throw new Error('Usage: node scripts/record-release-qa.mjs <tool...> --qa <result...>');
const tools = args.slice(0, separator);
const qa = args.slice(separator + 1).filter(Boolean);
if (!qa.length) throw new Error('At least one QA result is required.');

for (const tool of tools) {
  const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const release = manifest.versions.find((item) => item.version === manifest.latestVersion);
  if (!release) throw new Error(`${tool}: latest release is missing`);
  const notesPath = path.join(root, 'outputs', tool, release.patchNotes);
  const notes = JSON.parse(await fs.readFile(notesPath, 'utf8'));
  notes.qa = [...new Set([...(notes.qa || []), ...qa])];
  await fs.writeFile(notesPath, `${JSON.stringify(notes, null, 2)}\n`);
  console.log(`${tool} ${release.version}: recorded ${qa.length} QA results`);
}
