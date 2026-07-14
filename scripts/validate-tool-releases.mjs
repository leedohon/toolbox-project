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
}

console.log(
  `Validated ${jsonFiles.length} JSON files and all latest release paths.`,
);
