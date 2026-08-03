import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputsDir = path.join(root, 'outputs');
const startMarker = '<!-- toolbox-indexing:start -->';
const endMarker = '<!-- toolbox-indexing:end -->';

const escapeAttribute = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

async function loadManifests() {
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
  return manifests;
}

function canonicalFor(manifest, manifests) {
  if (!manifest) return '';
  if (manifest.status === 'retired') return manifests.get(manifest.replacementTool)?.postUrl || '';
  return manifest.postUrl || '';
}

function renderBlock(canonicalUrl) {
  return [
    startMarker,
    '<meta name="robots" content="noindex,follow">',
    canonicalUrl ? `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}">` : '',
    endMarker,
  ].filter(Boolean).join('\n  ');
}

function inject(html, block, filePath) {
  const marked = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
  if (marked.test(html)) return html.replace(marked, block);
  const head = html.match(/<head(?:\s[^>]*)?>/i);
  if (!head || head.index === undefined) return `${block}\n${html}`;
  const offset = head.index + head[0].length;
  return `${html.slice(0, offset)}\n  ${block}${html.slice(offset)}`;
}

const manifests = await loadManifests();
let updated = 0;
let canonicalCount = 0;
for (const [tool, manifest] of manifests) {
  const filePath = path.join(root, 'embed', tool, 'index.html');
  const canonicalUrl = canonicalFor(manifest, manifests);
  const html = await fs.readFile(filePath, 'utf8');
  const next = inject(html, renderBlock(canonicalUrl), filePath);
  if (next !== html) {
    await fs.writeFile(filePath, next);
    updated += 1;
  }
  if (canonicalUrl) canonicalCount += 1;
}

const rootIndex = path.join(root, 'index.html');
const rootCanonical = manifests.get('qr-barcode-generator')?.postUrl || '';
const rootHtml = await fs.readFile(rootIndex, 'utf8');
const nextRootHtml = inject(rootHtml, renderBlock(rootCanonical), rootIndex);
if (nextRootHtml !== rootHtml) {
  await fs.writeFile(rootIndex, nextRootHtml);
  updated += 1;
}
if (rootCanonical) canonicalCount += 1;

console.log(`Applied noindex to ${manifests.size + 1} public execution page(s); ${canonicalCount} canonical target(s); ${updated} file(s) changed.`);
