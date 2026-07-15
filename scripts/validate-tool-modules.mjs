import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const embedRoot = path.join(root, 'embed');
const entries = await fs.readdir(embedRoot, { withFileTypes: true });
let registryCount = 0;
let moduleCount = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const registryPath = path.join(embedRoot, entry.name, 'modules.json');
  let registry;
  try { registry = JSON.parse(await fs.readFile(registryPath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.modules) || !registry.modules.length) throw new Error(`${entry.name}: invalid module registry`);
  const ids = new Set();
  const messageTools = new Set();
  for (const module of registry.modules) {
    if (!/^[a-z0-9-]+$/.test(module.id || '') || ids.has(module.id)) throw new Error(`${entry.name}: invalid or duplicate module id ${module.id}`);
    ids.add(module.id);
    if (!module.label?.ko || !module.label?.en || !module.entry || !module.messageTool) throw new Error(`${entry.name}/${module.id}: required module fields are missing`);
    if (messageTools.has(module.messageTool)) throw new Error(`${entry.name}: duplicate messageTool ${module.messageTool}`);
    messageTools.add(module.messageTool);
    for (const capability of ['resultCode', 'png', 'copyFallback', 'i18n']) {
      if (typeof module.capabilities?.[capability] !== 'boolean') throw new Error(`${entry.name}/${module.id}: ${capability} capability must be boolean`);
    }
    const entryUrl = new URL(module.entry, `https://example.test/embed/${entry.name}/modules.json`);
    const relativePath = decodeURIComponent(entryUrl.pathname).replace(/^\//, '');
    const target = path.resolve(root, relativePath);
    const allowedRoot = path.resolve(embedRoot) + path.sep;
    if (!target.startsWith(allowedRoot)) throw new Error(`${entry.name}/${module.id}: module entry leaves embed root`);
    const stat = await fs.stat(target);
    if (!stat.isDirectory() && !stat.isFile()) throw new Error(`${entry.name}/${module.id}: module entry is not usable`);
    moduleCount += 1;
  }
  registryCount += 1;
}

console.log(`Validated ${moduleCount} modules in ${registryCount} registries.`);

