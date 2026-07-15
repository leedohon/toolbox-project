import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const embedDir = path.join(root, 'embed');
const loader = '<script src="../../assets/toolbox-ux.js?v=0.1.0"></script>';
const entries = await fs.readdir(embedDir, { withFileTypes: true });
let updated = 0;
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const file = path.join(embedDir, entry.name, 'index.html');
  let html;
  try { html = await fs.readFile(file, 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  if (html.includes('assets/toolbox-ux.js')) continue;
  const updatedHtml = html.includes('</head>') ? html.replace('</head>', `${loader}\n</head>`) : `${loader}\n${html}`;
  await fs.writeFile(file, updatedHtml);
  updated += 1;
}
console.log(`Added shared UX loader to ${updated} embeds.`);
