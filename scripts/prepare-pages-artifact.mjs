import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.resolve(root, process.argv[2] || '_site');
const relativeDestination = path.relative(root, destination);
if (!relativeDestination || relativeDestination.startsWith('..') || path.isAbsolute(relativeDestination)) {
  throw new Error('Pages artifact destination must be a new directory inside the repository.');
}

try {
  const existing = await fs.readdir(destination);
  if (existing.length) throw new Error(`Pages artifact destination is not empty: ${destination}`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await fs.mkdir(destination, { recursive: true });

await fs.cp(path.join(root, 'assets'), path.join(destination, 'assets'), { recursive: true });
await fs.mkdir(path.join(destination, 'embed'));
const outputEntries = await fs.readdir(path.join(root, 'outputs'), { withFileTypes: true });
let publishedEmbedCount = 0;
for (const entry of outputEntries) {
  if (!entry.isDirectory()) continue;
  try {
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'outputs', entry.name, 'versions.json'), 'utf8'));
    if (!manifest.postUrl) continue;
    await fs.cp(
      path.join(root, 'embed', manifest.tool),
      path.join(destination, 'embed', manifest.tool),
      { recursive: true },
    );
    publishedEmbedCount += 1;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
if (!publishedEmbedCount) throw new Error('No published execution pages were selected for the Pages artifact.');
for (const file of ['index.html', '.nojekyll']) {
  await fs.copyFile(path.join(root, file), path.join(destination, file));
}
await fs.mkdir(path.join(destination, 'outputs'));
for (const file of ['site.json', 'tools.json']) {
  await fs.copyFile(path.join(root, 'outputs', file), path.join(destination, 'outputs', file));
}

const topLevel = (await fs.readdir(destination)).sort();
const expected = ['.nojekyll', 'assets', 'embed', 'index.html', 'outputs'].sort();
if (JSON.stringify(topLevel) !== JSON.stringify(expected)) {
  throw new Error(`Unexpected Pages artifact entries: ${topLevel.join(', ')}`);
}
console.log(`Prepared curated GitHub Pages artifact with ${publishedEmbedCount} published execution page(s) at ${destination}.`);
