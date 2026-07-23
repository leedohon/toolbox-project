import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'toolbox', 'tool-hubs.json');
const checkOnly = process.argv.includes('--check');
const toolPattern = /^[a-z0-9-]+$/;
const defaultCapabilities = {
  resultCode: false,
  png: false,
  copyFallback: true,
  i18n: true,
  responsive: true,
  browserOnly: true,
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function assertLocalized(value, name) {
  if (!value?.ko || !value?.en) throw new Error(`${name}: Korean and English text are required`);
}

function assertCapabilities(capabilities, tool) {
  for (const key of ['resultCode', 'png', 'copyFallback', 'i18n']) {
    if (typeof capabilities?.[key] !== 'boolean') throw new Error(`${tool}: ${key} capability must be boolean`);
  }
}

async function readManifest(tool) {
  const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (manifest.tool !== tool || !manifest.latestVersion) throw new Error(`${tool}: invalid release manifest`);
  return manifest;
}

async function readCapabilities(tool) {
  const registryPath = path.join(root, 'embed', tool, 'modules.json');
  if (!(await exists(registryPath))) return { ...defaultCapabilities };
  const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'));
  const module = registry.modules?.find((item) => item.messageTool === tool)
    || (registry.modules?.length === 1 ? registry.modules[0] : null);
  if (!module) return { ...defaultCapabilities };
  assertCapabilities(module.capabilities, tool);
  return { ...defaultCapabilities, ...module.capabilities };
}

function renderIndex(hub, assetVersion) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(hub.title.ko)}</title>
  <link rel="stylesheet" href="../../assets/tool-hub.css?v=${escapeHtml(assetVersion)}">
  <link rel="stylesheet" href="../../assets/toolbox-i18n.css?v=0.1.0">
  <script src="../../assets/toolbox-i18n.js?v=0.3.1"></script>
  <script src="../../assets/toolbox-ux.js?v=0.1.0"></script>
</head>
<body>
  <main class="tool-hub" data-tool-hub data-tool="${escapeHtml(hub.tool)}" data-registry="./modules.json">
    <section class="tool-hub__picker" aria-label="${escapeHtml(hub.title.ko)}">
      <p class="tool-hub__help" data-ko="${escapeHtml(hub.help.ko)}" data-en="${escapeHtml(hub.help.en)}">${escapeHtml(hub.help.ko)}</p>
      <div data-tool-hub-control></div>
    </section>
    <p class="tool-hub__status" data-tool-hub-status aria-live="polite" data-ko="도구를 준비하고 있습니다." data-en="Preparing tools.">도구를 준비하고 있습니다.</p>
    <section class="tool-hub__stage" data-tool-hub-stage></section>
  </main>
  <script type="module" src="../../assets/tool-hub.js?v=${escapeHtml(assetVersion)}"></script>
</body>
</html>
`;
}

async function writeGenerated(target, content) {
  if (checkOnly) {
    const current = await fs.readFile(target, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (current !== content) throw new Error(`${path.relative(root, target)} is not up to date`);
    return;
  }
  await fs.writeFile(target, content);
}

const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
if (config.schemaVersion !== 1 || !/^\d+\.\d+\.\d+$/.test(config.assetVersion || '') || !Array.isArray(config.hubs)) {
  throw new Error('toolbox/tool-hubs.json is invalid');
}

const hubTools = new Set();
const assignedModules = new Set();
let moduleCount = 0;

for (const hub of config.hubs) {
  if (!toolPattern.test(hub.tool || '') || hubTools.has(hub.tool)) throw new Error(`Invalid or duplicate hub: ${hub.tool}`);
  assertLocalized(hub.title, `${hub.tool} title`);
  assertLocalized(hub.help, `${hub.tool} help`);
  if (!Array.isArray(hub.modules) || hub.modules.length < 2) throw new Error(`${hub.tool}: at least two modules are required`);
  if (hub.modules[0]?.tool !== hub.tool) throw new Error(`${hub.tool}: the first module must be the hub's original engine`);
  hubTools.add(hub.tool);

  const embedDirectory = path.join(root, 'embed', hub.tool);
  const indexPath = path.join(embedDirectory, 'index.html');
  const enginePath = path.join(embedDirectory, 'engine.html');
  if (!(await exists(indexPath))) throw new Error(`${hub.tool}: embed index is missing`);

  if (!(await exists(enginePath))) {
    if (checkOnly) throw new Error(`${hub.tool}: engine.html is missing`);
    const currentIndex = await fs.readFile(indexPath, 'utf8');
    if (/tool-hub\.js|data-tool-hub/.test(currentIndex)) {
      throw new Error(`${hub.tool}: refusing to copy a hub shell into engine.html`);
    }
    await fs.writeFile(enginePath, currentIndex);
  } else {
    const engine = await fs.readFile(enginePath, 'utf8');
    if (/tool-hub\.js|data-tool-hub/.test(engine)) throw new Error(`${hub.tool}: engine.html contains a recursive hub shell`);
  }

  const modules = [];
  const localIds = new Set();
  for (const configuredModule of hub.modules) {
    const tool = configuredModule.tool;
    const id = configuredModule.id || tool;
    if (!toolPattern.test(tool || '') || !toolPattern.test(id) || localIds.has(id)) {
      throw new Error(`${hub.tool}: invalid or duplicate module ${id}`);
    }
    if (assignedModules.has(tool)) throw new Error(`${tool}: module is assigned to more than one hub`);
    assertLocalized(configuredModule.label, `${hub.tool}/${id} label`);

    const sourceIndex = path.join(root, 'embed', tool, 'index.html');
    if (!(await exists(sourceIndex))) throw new Error(`${tool}: source embed is missing`);
    const manifest = await readManifest(tool);
    const capabilities = await readCapabilities(tool);
    assertCapabilities(capabilities, tool);
    const entry = tool === hub.tool
      ? `./engine.html?release=${encodeURIComponent(manifest.latestVersion)}`
      : `../${tool}/?release=${encodeURIComponent(manifest.latestVersion)}`;
    modules.push({
      id,
      label: configuredModule.label,
      entry,
      messageTool: tool,
      capabilities,
    });
    localIds.add(id);
    assignedModules.add(tool);
    moduleCount += 1;
  }

  const registry = {
    schemaVersion: 1,
    hub: {
      kind: 'iframe',
      tool: hub.tool,
      title: hub.title,
      help: hub.help,
    },
    modules,
  };
  await writeGenerated(path.join(embedDirectory, 'modules.json'), `${JSON.stringify(registry, null, 2)}\n`);
  await writeGenerated(indexPath, renderIndex(hub, config.assetVersion));
}

console.log(`${checkOnly ? 'Checked' : 'Built'} ${config.hubs.length} tool hubs with ${moduleCount} modules.`);
