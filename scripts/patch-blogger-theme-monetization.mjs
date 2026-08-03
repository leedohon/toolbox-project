import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = path.resolve(process.argv[2] || '');
const outputPath = path.resolve(process.argv[3] || path.join(root, 'toolbox', 'theme', 'openworld-toolbox-upload.xml'));
if (!process.argv[2]) throw new Error('Usage: node scripts/patch-blogger-theme-monetization.mjs <live-theme.xml> [output.xml]');

let xml = await fs.readFile(inputPath, 'utf8');
const original = xml;
const retiredFilter = 'data:posts where (p => p.labels none (l => l.name == &quot;toolbox-retired&quot;))';
const retiredRobotsCondition = 'data:post.labels any (label => label.name == &quot;toolbox-retired&quot;)';
const retiredRobotsLines = [
  `<b:if cond='${retiredRobotsCondition}'>`,
  "  <meta content='noindex,follow' name='robots'/>",
  '</b:if>',
];
const indent = (lines, spaces) => lines.map((line) => `${' '.repeat(spaces)}${line}`).join('\n');
const desktopLoop = "<b:loop values='data:posts' var='post'>";
const filteredDesktopLoop = `<b:loop values='data:blog.pageType == &quot;item&quot; ? data:posts : ${retiredFilter}' var='post'>`;
const mobileIndex = [
  "<b:if cond='data:blog.pageType == &quot;index&quot;'>",
  `        ${desktopLoop}`,
].join('\n');
const filteredMobileIndex = [
  "<b:if cond='data:blog.pageType == &quot;index&quot;'>",
  `        <b:loop values='${retiredFilter}' var='post'>`,
].join('\n');

if (!xml.includes('openworld.loader.url')) throw new Error('The live theme does not contain the Openworld loader variable.');
if (!xml.includes("<b:widget-setting name='showInlineAds'>false</b:widget-setting>")) {
  throw new Error('Inline ads must remain disabled during approval remediation.');
}
if (!xml.includes(desktopLoop)) throw new Error('Desktop post loop was not found.');
xml = xml.replace(desktopLoop, `${filteredDesktopLoop}\n${indent(retiredRobotsLines, 8)}`);
if (!xml.includes(mobileIndex)) throw new Error('Mobile index post loop was not found.');
xml = xml.replace(mobileIndex, filteredMobileIndex);
const mobileItemLoop = [
  "        <b:loop values='data:posts' var='post'>",
  "          <b:include data='post' name='mobile-post'/>",
].join('\n');
const protectedMobileItemLoop = [
  "        <b:loop values='data:posts' var='post'>",
  indent(retiredRobotsLines, 10),
  "          <b:include data='post' name='mobile-post'/>",
].join('\n');
if (!xml.includes(mobileItemLoop)) throw new Error('Mobile item post loop was not found.');
xml = xml.replace(mobileItemLoop, protectedMobileItemLoop);

for (const widgetId of ['AdSense1', 'AdSense2', 'FeaturedPost1', 'PopularPosts1']) {
  const pattern = new RegExp(`\\s*<b:widget id='${widgetId}'[\\s\\S]*?</b:widget>`);
  if (pattern.test(xml)) xml = xml.replace(pattern, '');
}
const inlineAdPattern = /\s*<!-- Ad -->\s*<b:if cond='data:post\.includeAd'>[\s\S]*?<\/b:if>/;
if (inlineAdPattern.test(xml)) xml = xml.replace(inlineAdPattern, '');

if (xml === original) throw new Error('No theme changes were produced.');
if ((xml.match(/p\.labels none \(l => l\.name == &quot;toolbox-retired&quot;\)/g) || []).length !== 2) {
  throw new Error('Exactly two retired-post list filters are required.');
}
if ((xml.match(/data:post\.labels any \(label => label\.name == &quot;toolbox-retired&quot;\)/g) || []).length !== 2) {
  throw new Error('Exactly two server-rendered retired-post noindex conditions are required.');
}
if ((xml.match(/<meta content='noindex,follow' name='robots'\/>/g) || []).length !== 2) {
  throw new Error('Exactly two server-rendered retired-post robots tags are required.');
}
if (/<b:widget id='(?:AdSense1|AdSense2|FeaturedPost1|PopularPosts1)'/.test(xml)) {
  throw new Error('Approval-blocking widgets remain in the patched theme.');
}
if (/data:post\.includeAd|<data:adCode\s*\/>/.test(xml)) {
  throw new Error('Inline ad rendering remains in the patched theme.');
}

const backupPath = path.join(root, 'toolbox', 'theme', 'backups', 'theme-2198164223054760451-20260725-live.xml');
await fs.mkdir(path.dirname(backupPath), { recursive: true });
await fs.copyFile(inputPath, backupPath);
await fs.writeFile(outputPath, xml);
console.log(`Saved live backup: ${backupPath}`);
console.log(`Prepared monetization-safe theme: ${outputPath}`);
