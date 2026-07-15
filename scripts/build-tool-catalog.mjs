import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputs = path.join(root, 'outputs');
const tagsPath = path.join(root, 'toolbox', 'post-tags.json');

export async function buildToolCatalog() {
  const entries = await fs.readdir(outputs, { withFileTypes: true });
  const tagsDocument = JSON.parse(await fs.readFile(tagsPath, 'utf8'));
  const tools = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const versionsPath = path.join(outputs, entry.name, 'versions.json');
    try {
      const versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      if (versions.status === 'retired') continue;
      const keywords = [...new Set([...(tagsDocument.tools?.[versions.tool] || []), ...(tagsDocument.keywords?.[versions.tool] || [])])];
      if (keywords.length < 20 || keywords.length > 30) throw new Error(`${versions.tool}: 20~30개의 검색 키워드가 필요합니다.`);
      tools.push({
        index: versions.index,
        tool: versions.tool,
        title: versions.title,
        description: versions.description,
        postUrl: versions.postUrl || '',
        version: versions.latestVersion,
        keywords,
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  tools.sort((left, right) => Number(left.index) - Number(right.index));
  const indexes = new Set(tools.map((tool) => tool.index));
  if (indexes.size !== tools.length) throw new Error('Tool indexes must be unique.');
  for (const tool of tools) {
    if (!Number.isInteger(tool.index) || tool.index < 1) throw new Error(`Invalid index: ${tool.tool}`);
    if (!tool.tool || !tool.title || !tool.description || !tool.version) throw new Error(`Missing catalog field: ${tool.tool}`);
    if (tool.postUrl && !/^https:\/\//.test(tool.postUrl)) throw new Error(`Post URL must use HTTPS: ${tool.tool}`);
  }

  const catalog = { updatedAt: new Date().toISOString().slice(0, 10), tools };
  await fs.writeFile(path.join(outputs, 'tools.json'), `${JSON.stringify(catalog, null, 2)}\n`);
  return catalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = await buildToolCatalog();
  console.log(`Updated outputs/tools.json with ${catalog.tools.length} tools.`);
}
