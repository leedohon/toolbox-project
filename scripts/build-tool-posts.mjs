import { buildToolPostContent } from './build-tool-post-content.mjs';
import { buildPostPatchNotes } from './build-post-patch-notes.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumentsList = process.argv.slice(2);
const fromRunIndex = argumentsList.indexOf('--from-run');
let tools = argumentsList.filter((argument, index) => !argument.startsWith('--') && !(fromRunIndex >= 0 && index === fromRunIndex + 1));
if (fromRunIndex >= 0) {
  const runId = argumentsList[fromRunIndex + 1];
  if (!runId || runId.startsWith('--')) throw new Error('--from-run requires a workflow run ID.');
  let runDocument = null;
  for (const state of ['unchecked', 'checked']) {
    try { runDocument = JSON.parse(await fs.readFile(path.join(root, 'toolbox', 'automation-results', state, `${runId}.json`), 'utf8')); break; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!runDocument?.selectedTools?.length) throw new Error(`Workflow result with selectedTools not found: ${runId}`);
  tools = runDocument.selectedTools;
}
const content = await buildToolPostContent(tools);
const patches = await buildPostPatchNotes(tools);
if (content.length !== patches.length) throw new Error('Post content and patch-note build counts do not match.');
console.log(`Built consistent post content for ${content.length} tools.`);
