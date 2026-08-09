import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const separator = args.indexOf('--qa');
const profileAt = args.indexOf('--profile');
const fromRunAt = args.indexOf('--from-run');
const splitAt = [separator, profileAt, fromRunAt].filter((value) => value >= 0).sort((a, b) => a - b)[0];
if (splitAt == null) throw new Error('Usage: node scripts/record-release-qa.mjs [<tool...> | --from-run <run-id>] (--qa <result...> | --profile responsive-standard)');
let selectedTools = args.slice(0, splitAt);
if (fromRunAt >= 0) {
  const runId = args[fromRunAt + 1];
  if (!runId || runId.startsWith('--')) throw new Error('--from-run requires a workflow run ID.');
  let runDocument = null;
  for (const state of ['unchecked', 'checked']) {
    try { runDocument = JSON.parse(await fs.readFile(path.join(root, 'toolbox', 'automation-results', state, `${runId}.json`), 'utf8')); break; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!runDocument?.selectedTools?.length) throw new Error(`Workflow result with selectedTools not found: ${runId}`);
  selectedTools = runDocument.selectedTools;
}
if (!selectedTools.length) throw new Error('At least one tool or --from-run is required.');
const profiles = {
  'responsive-standard': [
    '375×812 모바일 기능 조작 및 가로 넘침 없음',
    '1280×900 데스크톱 기능 조작 및 가로 넘침 없음',
    'KOR/ENG 접근성 이름 동기화 확인',
    '브라우저 콘솔 오류 0건',
  ],
};
const profileName = profileAt >= 0 ? args[profileAt + 1] : null;
if (profileName && !profiles[profileName]) throw new Error(`Unknown QA profile: ${profileName}`);
const qa = [...(profileName ? profiles[profileName] : []), ...(separator >= 0 ? args.slice(separator + 1).filter(Boolean) : [])];
if (!qa.length) throw new Error('At least one QA result is required.');

for (const tool of selectedTools) {
  const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const release = manifest.versions.find((item) => item.version === manifest.latestVersion);
  if (!release) throw new Error(`${tool}: latest release is missing`);
  const notesPath = path.join(root, 'outputs', tool, release.patchNotes);
  const notes = JSON.parse(await fs.readFile(notesPath, 'utf8'));
  notes.qa = [...new Set([...(notes.qa || []), ...qa])];
  await fs.writeFile(notesPath, `${JSON.stringify(notes, null, 2)}\n`);
  console.log(`${tool} ${release.version}: recorded ${qa.length} QA results`);
}
