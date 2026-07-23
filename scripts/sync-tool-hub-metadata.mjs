import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'toolbox', 'tool-hubs.json');
const toolsDirectory = path.join(root, 'toolbox', 'tools');
const outputsDirectory = path.join(root, 'outputs');
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');

if (args.some((argument) => argument !== '--check') || args.filter((argument) => argument === '--check').length > 1) {
  throw new Error('Usage: node scripts/sync-tool-hub-metadata.mjs [--check]');
}

function parseScalar(value) {
  const trimmed = String(value || '').trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return JSON.parse(trimmed);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'");
  if (trimmed === 'null' || trimmed === '~') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  return trimmed;
}

function parseFrontmatter(source, file) {
  const normalized = source.replace(/^\uFEFF/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(normalized);
  if (!match) throw new Error(`${file}: YAML frontmatter is missing`);
  const result = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s/.test(line) || line.trimStart().startsWith('#')) continue;
    const field = /^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/.exec(line);
    if (!field) throw new Error(`${file}: invalid top-level frontmatter line: ${line}`);
    result[field[1]] = parseScalar(field[2]);
  }
  return result;
}

function assertToolName(tool, context) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool || '')) throw new Error(`${context}: invalid tool name ${tool || '(missing)'}`);
}

function assertText(value, context) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${context} is required`);
}

async function readDefinition(tool) {
  const file = path.join(toolsDirectory, `${tool}.md`);
  const definition = parseFrontmatter(await fs.readFile(file, 'utf8'), path.relative(root, file));
  if (definition.slug !== tool) throw new Error(`${tool}: frontmatter slug must match the tool name`);
  assertText(definition.title, `${tool}: frontmatter title`);
  assertText(definition.description, `${tool}: frontmatter description`);
  return definition;
}

async function readManifest(tool) {
  const file = path.join(outputsDirectory, tool, 'versions.json');
  const manifest = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error(`${tool}: invalid versions manifest`);
  if (manifest.tool !== tool) throw new Error(`${tool}: manifest tool field does not match`);
  for (const field of ['index', 'postUrl', 'versions', 'latestVersion']) {
    if (!(field in manifest)) throw new Error(`${tool}: protected manifest field ${field} is missing`);
  }
  return { file, manifest };
}

const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
if (config.schemaVersion !== 1 || !Array.isArray(config.hubs) || !config.hubs.length) {
  throw new Error('toolbox/tool-hubs.json must contain a non-empty schemaVersion 1 hubs array');
}

const hubTools = new Set();
for (const hub of config.hubs) {
  assertToolName(hub.tool, 'hub');
  if (hubTools.has(hub.tool)) throw new Error(`Duplicate hub: ${hub.tool}`);
  hubTools.add(hub.tool);
}

const memberOwners = new Map();
for (const hub of config.hubs) {
  assertText(hub.title?.ko, `${hub.tool}: Korean hub title`);
  assertText(hub.title?.en, `${hub.tool}: English hub title`);
  if (!Array.isArray(hub.modules) || !hub.modules.length) throw new Error(`${hub.tool}: modules are required`);
  const localMembers = new Set();
  for (const module of hub.modules) {
    assertToolName(module.tool, `${hub.tool}: module`);
    if (localMembers.has(module.tool)) throw new Error(`${hub.tool}: duplicate member ${module.tool}`);
    if (memberOwners.has(module.tool)) throw new Error(`${module.tool}: assigned to both ${memberOwners.get(module.tool)} and ${hub.tool}`);
    if (module.tool !== hub.tool && hubTools.has(module.tool)) throw new Error(`${module.tool}: a hub cannot be a member of ${hub.tool}`);
    localMembers.add(module.tool);
    memberOwners.set(module.tool, hub.tool);
  }
  if (!localMembers.has(hub.tool)) throw new Error(`${hub.tool}: the hub must include itself as a module`);
}

const plans = [];
for (const hub of config.hubs) {
  const hubDefinition = await readDefinition(hub.tool);
  if (hubDefinition.status !== 'published') throw new Error(`${hub.tool}: hub frontmatter status must be published`);
  if (hubDefinition.replacementTool) throw new Error(`${hub.tool}: a published hub cannot declare replacementTool`);
  const hubManifest = await readManifest(hub.tool);
  plans.push({
    tool: hub.tool,
    ...hubManifest,
    desired: {
      title: hubDefinition.title,
      description: hubDefinition.description,
      status: 'published',
    },
  });

  for (const module of hub.modules) {
    if (module.tool === hub.tool) continue;
    const memberDefinition = await readDefinition(module.tool);
    if (memberDefinition.status !== 'retired') throw new Error(`${module.tool}: member frontmatter status must be retired`);
    if (memberDefinition.replacementTool !== hub.tool) {
      throw new Error(`${module.tool}: frontmatter replacementTool must be ${hub.tool}`);
    }
    const memberManifest = await readManifest(module.tool);
    plans.push({
      tool: module.tool,
      ...memberManifest,
      desired: {
        status: 'retired',
        replacementTool: hub.tool,
        legacyTitle: memberDefinition.title,
      },
    });
  }
}

for (const plan of plans) {
  plan.changedFields = Object.entries(plan.desired)
    .filter(([field, value]) => plan.manifest[field] !== value)
    .map(([field]) => field);
  plan.updated = { ...plan.manifest, ...plan.desired };
}

const drift = plans.filter((plan) => plan.changedFields.length);
if (checkOnly) {
  if (drift.length) {
    throw new Error(`Tool hub metadata drift:\n${drift.map((plan) => `- ${plan.tool}: ${plan.changedFields.join(', ')}`).join('\n')}`);
  }
  console.log(`Tool hub metadata is synchronized for ${plans.length} tool(s).`);
  process.exit(0);
}

for (const plan of drift) {
  await fs.writeFile(plan.file, `${JSON.stringify(plan.updated, null, 2)}\n`);
  console.log(`Synchronized ${plan.tool}: ${plan.changedFields.join(', ')}`);
}
console.log(`Tool hub metadata synchronization complete: ${drift.length} changed, ${plans.length - drift.length} unchanged.`);
