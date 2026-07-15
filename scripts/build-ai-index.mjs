import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputs = path.join(root, 'outputs');
const requestedTools = process.argv.slice(2);
const date = new Date().toISOString().slice(0, 10);
const relative = (value) => path.relative(root, value).replaceAll('\\', '/');
const exists = async (value) => fs.access(value).then(() => true).catch(() => false);
const writeJson = async (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);

const entries = await fs.readdir(outputs, { withFileTypes: true });
const tools = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const manifestPath = path.join(outputs, entry.name, 'versions.json');
  let manifest;
  try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  const definition = path.join(root, 'toolbox', 'tools', `${manifest.tool}.md`);
  const post = path.join(root, 'toolbox', 'posts', `${manifest.tool}.html`);
  const embed = path.join(root, 'embed', manifest.tool, 'index.html');
  const modules = path.join(root, 'embed', manifest.tool, 'modules.json');
  tools.push({
    index: manifest.index,
    tool: manifest.tool,
    title: manifest.title,
    category: manifest.category || '초간단 툴박스',
    status: manifest.status || 'published',
    replacementTool: manifest.replacementTool || null,
    latestVersion: manifest.latestVersion,
    paths: {
      definition: await exists(definition) ? relative(definition) : null,
      post: await exists(post) ? relative(post) : null,
      manifest: relative(manifestPath),
      embed: await exists(embed) ? relative(embed) : null,
      moduleRegistry: await exists(modules) ? relative(modules) : null,
    },
  });
}
tools.sort((a, b) => Number(a.index) - Number(b.index));

await writeJson(path.join(root, 'ai-index.json'), {
  schemaVersion: 1,
  updatedAt: date,
  project: 'blogger',
  purpose: 'Route AI work to the smallest current source set before repository-wide search.',
  instructions: ['AGENTS.md', 'toolbox/AGENTS.md'],
  indexes: { toolbox: 'toolbox/ai-index.json' },
  guides: ['toolbox/guides/post-drafting-guide.md', 'toolbox/guides/tool-module-compatibility.md', 'toolbox/guides/ai-index-guide.md'],
});

await writeJson(path.join(root, 'toolbox', 'ai-index.json'), {
  schemaVersion: 1,
  updatedAt: date,
  project: 'toolbox',
  keySources: {
    content: 'toolbox/post-content.json',
    discovery: 'toolbox/post-tags.json',
    catalog: 'outputs/tools.json',
    sharedPostTheme: 'assets/blogger/theme.css',
    sharedToolStyles: ['assets/simple-tools.css', 'assets/play-tools.css'],
    sharedUx: 'assets/toolbox-ux.js',
  },
  tools,
});

for (const tool of requestedTools) {
  const item = tools.find((candidate) => candidate.tool === tool);
  if (!item) throw new Error(`Unknown tool: ${tool}`);
  const directory = path.join(root, 'embed', tool);
  await fs.mkdir(directory, { recursive: true });
  let registry = null;
  if (item.paths.moduleRegistry) registry = JSON.parse(await fs.readFile(path.join(root, item.paths.moduleRegistry), 'utf8'));
  await writeJson(path.join(directory, 'ai-index.json'), {
    schemaVersion: 1,
    updatedAt: date,
    tool: item.tool,
    index: item.index,
    title: item.title,
    category: item.category,
    status: item.status,
    replacementTool: item.replacementTool,
    latestVersion: item.latestVersion,
    paths: item.paths,
    modules: registry?.modules || [],
    compatibilityGuide: 'toolbox/guides/tool-module-compatibility.md',
  });
}

console.log(`Built AI indexes for ${tools.length} tools${requestedTools.length ? ` and ${requestedTools.length} tool folders` : ''}.`);

