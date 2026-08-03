import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputsDir = path.join(root, 'outputs');
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

for (const [tool, manifest] of manifests) {
  await validate(path.join(root, 'embed', tool, 'index.html'), expectedCanonical(manifest));
}
await validate(path.join(root, 'index.html'), manifests.get('qr-barcode-generator')?.postUrl || '');
console.log(`Validated indexing policy for ${manifests.size + 1} execution page(s).`);
