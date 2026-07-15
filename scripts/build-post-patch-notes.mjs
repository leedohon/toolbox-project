import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputsDir = path.join(root, 'outputs');
const postsDir = path.join(root, 'toolbox', 'posts');
const startMarker = '<!-- tb-patch-notes:start -->';
const endMarker = '<!-- tb-patch-notes:end -->';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function renderRelease(tool, release, notes) {
  const headingId = `tb-patch-${tool}-${release.version.replace(/[^a-z0-9]+/gi, '-')}`;
  const changes = Array.isArray(notes.changes) ? notes.changes : [];
  if (!changes.length) throw new Error(`${tool} ${release.version}: changes are missing`);
  return [
    `<section class="tb-patch-release" aria-labelledby="${headingId}">`,
    `<h3 id="${headingId}"><span>${escapeHtml(release.version)}</span><time datetime="${escapeHtml(release.releaseDate)}">${escapeHtml(release.releaseDate)}</time></h3>`,
    `<ul>${changes.map((change) => `<li>${escapeHtml(change)}</li>`).join('')}</ul>`,
    '</section>',
  ].join('');
}
async function renderPatchNotes(manifest) {
  const releases = [];
  for (const release of [...manifest.versions].reverse()) {
    const notesPath = path.join(outputsDir, manifest.tool, release.patchNotes);
    const notes = JSON.parse(await fs.readFile(notesPath, 'utf8'));
    releases.push(renderRelease(manifest.tool, release, notes));
  }
  return `${startMarker}<details class="tb-patch-notes"><summary>패치노트</summary><div class="tb-patch-list">${releases.join('')}</div></details>${endMarker}`;
}

function injectPatchNotes(html, block, tool) {
  const markedPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
  if (markedPattern.test(html)) return html.replace(markedPattern, block);
  const articleClose = html.lastIndexOf('</article>');
  if (articleClose < 0) throw new Error(`${tool}: closing article tag is missing`);
  return `${html.slice(0, articleClose)}  ${block}\n${html.slice(articleClose)}`;
}

export async function buildPostPatchNotes(toolNames = []) {
  const entries = await fs.readdir(outputsDir, { withFileTypes: true });
  const requested = new Set(toolNames);
  const built = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || (requested.size && !requested.has(entry.name))) continue;
    const versionsPath = path.join(outputsDir, entry.name, 'versions.json');
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (!requested.size && manifest.status === 'retired') continue;

    const latest = manifest.versions.find((release) => release.version === manifest.latestVersion);
    if (!latest) throw new Error(`${manifest.tool}: latest version entry is missing`);
    const postPath = path.join(postsDir, `${manifest.tool}.html`);
    const postHtml = await fs.readFile(postPath, 'utf8');
    const block = await renderPatchNotes(manifest);
    const updated = injectPatchNotes(postHtml, block, manifest.tool);
    await fs.writeFile(postPath, updated);
    await fs.writeFile(path.join(outputsDir, manifest.tool, latest.html), updated);
    built.push(manifest.tool);
  }

  if (requested.size && built.length !== requested.size) {
    const missing = [...requested].filter((tool) => !built.includes(tool));
    throw new Error(`Unknown tools: ${missing.join(', ')}`);
  }
  return built;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const built = await buildPostPatchNotes(process.argv.slice(2));
  console.log(`Updated cumulative post patch notes for ${built.length} tools.`);
}
