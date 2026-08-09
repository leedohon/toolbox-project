import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const fromRunAt = args.indexOf('--from-run');
let tools = args.filter((value, index) => /^[a-z0-9-]+$/.test(value) && !(fromRunAt >= 0 && index === fromRunAt + 1));
if (fromRunAt >= 0) {
  const runId = args[fromRunAt + 1];
  if (!runId || runId.startsWith('--')) throw new Error('--from-run requires a workflow run ID.');
  let runDocument = null;
  for (const state of ['unchecked', 'checked']) {
    const candidate = path.join(root, 'toolbox', 'automation-results', state, `${runId}.json`);
    if (fs.existsSync(candidate)) { runDocument = JSON.parse(fs.readFileSync(candidate, 'utf8')); break; }
  }
  if (!runDocument?.selectedTools?.length) throw new Error(`Workflow result with selectedTools not found: ${runId}`);
  tools = runDocument.selectedTools;
}

if (!tools.length) {
  console.error('Usage: node scripts/workflow-target-snapshot.mjs [<tool...> | --from-run <run-id>]');
  process.exit(1);
}

function bumpMinor(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)v$/.exec(version || '');
  return match ? `${match[1]}.${Number(match[2]) + 1}.0v` : null;
}

function frontmatter(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const read = (key) => block?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || null;
  return { title: read('title'), status: read('status'), description: read('description') };
}

function features(text) {
  const section = text.match(/(?:^|\n)#{1,2}\s+(?:기능|## 기능)\s*\r?\n([\s\S]*?)(?=\r?\n#|$)/i)?.[1] || '';
  return section.split(/\r?\n/).filter((line) => /^-\s+/.test(line)).map((line) => line.replace(/^-\s+/, '').trim()).slice(0, 12);
}

let inputCharacters = 0;
const targets = tools.map((tool) => {
  const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
  const definitionPath = path.join(root, 'toolbox', 'tools', `${tool}.md`);
  const manifestText = fs.readFileSync(manifestPath, 'utf8');
  const definitionText = fs.readFileSync(definitionPath, 'utf8');
  inputCharacters += manifestText.length + definitionText.length;
  const manifest = JSON.parse(manifestText);
  const definition = frontmatter(definitionText);
  return {
    tool,
    index: manifest.index,
    title: manifest.title || definition.title,
    status: manifest.status || definition.status,
    latestVersion: manifest.latestVersion,
    suggestedMinor: bumpMinor(manifest.latestVersion),
    postUrl: manifest.postUrl,
    description: manifest.description || definition.description,
    features: features(definitionText),
    paths: {
      definition: `toolbox/tools/${tool}.md`,
      manifest: `outputs/${tool}/versions.json`,
      embed: `embed/${tool}/index.html`,
      moduleRegistry: fs.existsSync(path.join(root, 'embed', tool, 'modules.json')) ? `embed/${tool}/modules.json` : null
    }
  };
});

const compact = JSON.stringify(targets);
console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  targets,
  efficiency: {
    metric: 'target manifest and definition characters emitted for selection',
    before: inputCharacters,
    after: compact.length,
    reduction: Number((1 - compact.length / inputCharacters).toFixed(4))
  }
}, null, 2));
