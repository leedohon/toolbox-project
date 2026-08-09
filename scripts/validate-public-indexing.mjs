import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputsDir = path.join(root, 'outputs');
const args = process.argv.slice(2);
let selectedTools = null;
const fromRunIndex = args.indexOf('--from-run');
if (fromRunIndex >= 0) {
  const runId = args[fromRunIndex + 1];
  if (!runId) throw new Error('Usage: node scripts/validate-public-indexing.mjs --from-run RUN_ID');
  for (const bucket of ['unchecked', 'checked']) {
    try {
      const result = JSON.parse(await fs.readFile(path.join(root, 'toolbox', 'automation-results', bucket, `${runId}.json`), 'utf8'));
      selectedTools = new Set(result.selectedTools || []);
      break;
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!selectedTools?.size) throw new Error(`Automation result or selectedTools not found: ${runId}`);
}
const entries = await fs.readdir(outputsDir, { withFileTypes: true });
const manifests = new Map();

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  try {
    const document = JSON.parse(await fs.readFile(path.join(outputsDir, entry.name, 'versions.json'), 'utf8'));
    manifests.set(document.tool, document);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function expectedCanonical(manifest) {
  if (manifest.status === 'retired') return manifests.get(manifest.replacementTool)?.postUrl || '';
  return manifest.postUrl || '';
}

async function validate(filePath, canonicalUrl) {
  const html = await fs.readFile(filePath, 'utf8');
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["'][^>]*>/gi) || [];
  if (robots.length !== 1 || !/noindex\s*,\s*follow/i.test(robots[0])) {
    throw new Error(`${filePath}: exactly one noindex,follow robots meta is required`);
  }
  const canonicals = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  if (canonicalUrl && (canonicals.length !== 1 || canonicals[0] !== canonicalUrl)) {
    throw new Error(`${filePath}: canonical must be ${canonicalUrl}`);
  }
  if (!canonicalUrl && canonicals.length) throw new Error(`${filePath}: unpublished execution pages must not claim a canonical URL`);
}

let validated = 0;
for (const [tool, manifest] of manifests) {
  if (selectedTools && !selectedTools.has(tool)) continue;
  await validate(path.join(root, 'embed', tool, 'index.html'), expectedCanonical(manifest));
  validated += 1;
}
if (!selectedTools) {
  await validate(path.join(root, 'index.html'), manifests.get('qr-barcode-generator')?.postUrl || '');
  validated += 1;
}
console.log(`Validated indexing policy for ${validated} execution page(s).`);
