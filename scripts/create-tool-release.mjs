import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const tool = args.shift();
const level = args.shift();
const dryRunIndex = args.indexOf('--dry-run');
const dryRun = dryRunIndex >= 0;
if (dryRun) args.splice(dryRunIndex, 1);

function values(flag) {
  const found = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) found.push(args[index + 1]);
  }
  return found;
}

if (!tool || !['minimum', 'minor', 'major'].includes(level)) {
  throw new Error('Usage: node scripts/create-tool-release.mjs <tool> <minimum|minor|major> --summary "..." --change "..." [--dry-run]');
}

const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const current = manifest.versions.find((release) => release.version === manifest.latestVersion);
if (!current) throw new Error(`${tool}: latest release is missing`);
const match = /^(\d+)\.(\d+)\.(\d+)v$/.exec(current.version);
if (!match) throw new Error(`${tool}: invalid version ${current.version}`);
let major = Number(match[1]);
let minor = Number(match[2]);
let minimum = Number(match[3]);
if (level === 'major') { major += 1; minor = 0; minimum = 0; }
if (level === 'minor') { minor += 1; minimum = 0; }
if (level === 'minimum') minimum += 1;
const version = `${major}.${minor}.${minimum}v`;
console.log(`${tool}: ${current.version} -> ${version}`);
if (dryRun) process.exit(0);

const summary = values('--summary')[0];
const changes = values('--change');
if (!summary || !changes.length) throw new Error('A summary and at least one --change are required.');
const directory = path.join(root, 'outputs', tool, version);
await fs.mkdir(directory);
const htmlName = path.basename(current.html);
await fs.copyFile(path.join(root, 'toolbox', 'posts', `${tool}.html`), path.join(directory, htmlName));
const releaseDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
await fs.writeFile(path.join(directory, 'patch-notes.json'), `${JSON.stringify({ tool, version, releaseDate, changeLevel: level, changes }, null, 2)}\n`);
manifest.latestVersion = version;
manifest.versions.push({ version, releaseDate, changeLevel: level, summary, directory: version, html: `${version}/${htmlName}`, patchNotes: `${version}/patch-notes.json` });
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
