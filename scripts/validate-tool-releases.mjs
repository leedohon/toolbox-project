import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outputRoot = "outputs";
const jsonFiles = [];

function collectJson(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) collectJson(filePath);
    else if (entry.name.endsWith(".json")) jsonFiles.push(filePath);
  }
}

collectJson(outputRoot);
for (const filePath of jsonFiles) {
  JSON.parse(readFileSync(filePath, "utf8"));
}

const toolDirectories = readdirSync(outputRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const tool of toolDirectories) {
  const versionFile = join(outputRoot, tool, "versions.json");
  const manifest = JSON.parse(readFileSync(versionFile, "utf8"));
  const latest = manifest.versions.find(
    (release) => release.version === manifest.latestVersion,
  );

  if (!latest) throw new Error(`${tool}: latest version entry is missing`);

  for (const key of ["html", "patchNotes"]) {
    const releasePath = join(outputRoot, tool, latest[key]);
    if (!existsSync(releasePath)) throw new Error(`${tool}: missing ${releasePath}`);
  }

  const latestHtml = readFileSync(join(outputRoot, tool, latest.html), "utf8");
  if (!latestHtml.includes('class="tb-patch-notes"')) {
    throw new Error(`${tool}: latest post is missing cumulative patch notes`);
  }
  if (!latestHtml.includes('class="tb-tool-details"')) {
    throw new Error(`${tool}: latest post is missing detailed guidance`);
  }
  const faqMatch = latestHtml.match(/<!-- tb-faq:start -->([\s\S]*?)<!-- tb-faq:end -->/);
  const faqCount = faqMatch ? (faqMatch[1].match(/<details>/g) || []).length : 0;
  if (faqCount < 4) throw new Error(`${tool}: at least four user FAQs are required`);
  if (/게시글을 다시 수정|업데이트 때 게시글/.test(latestHtml)) {
    throw new Error(`${tool}: operator-facing FAQ must not be published`);
  }
  for (const release of manifest.versions) {
    if (!latestHtml.includes(`>${release.version}</span>`)) {
      throw new Error(`${tool}: latest post is missing patch version ${release.version}`);
    }
  }

  const embedPath = join('embed', tool, 'index.html');
  const embedHtml = readFileSync(embedPath, 'utf8');
  if (!embedHtml.includes('assets/toolbox-ux.js')) throw new Error(`${tool}: shared UX loader is missing`);
  const withoutSafeFocus = embedHtml.replaceAll('ToolboxUX?.focusAndSelect(', '').replaceAll('ToolboxUX?.focus(', '');
  if (/\.focus\s*\(|\bautofocus\b/i.test(withoutSafeFocus)) throw new Error(`${tool}: direct or automatic focus is not allowed`);
}

console.log(
  `Validated ${jsonFiles.length} JSON files and all latest release paths.`,
);
