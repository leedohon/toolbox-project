import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themePath = path.resolve(process.argv[2] || path.join(root, 'toolbox', 'theme', 'openworld-toolbox-upload.xml'));
const xml = await fs.readFile(themePath, 'utf8');
const failures = [];

if (!xml.includes("<b:widget-setting name='showInlineAds'>false</b:widget-setting>")) failures.push('inline ads are not disabled');
if ((xml.match(/p\.labels none \(l => l\.name == &quot;toolbox-retired&quot;\)/g) || []).length !== 2) {
  failures.push('desktop/mobile retired-post list filters are incomplete');
}
if ((xml.match(/data:post\.labels any \(label => label\.name == &quot;toolbox-retired&quot;\)/g) || []).length !== 2
  || (xml.match(/<meta content='noindex,follow' name='robots'\/>/g) || []).length !== 2) {
  failures.push('desktop/mobile retired-post noindex conditions are incomplete');
}
for (const widgetId of ['AdSense1', 'AdSense2', 'FeaturedPost1', 'PopularPosts1']) {
  if (xml.includes(`<b:widget id='${widgetId}'`)) failures.push(`${widgetId} must be absent during approval remediation`);
}
if (/data:post\.includeAd|<data:adCode\s*\/>/.test(xml)) failures.push('inline ad rendering must be absent during approval remediation');
if (!xml.includes('https://leedohon.github.io/toolbox-project/assets/blogger/site.js')) failures.push('Openworld loader URL is missing');
for (const tag of ['b:loop', 'b:if']) {
  const openCount = (xml.match(new RegExp(`<${tag}(?:\\s|>)`, 'g')) || []).length;
  const closeCount = (xml.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  if (openCount !== closeCount) failures.push(`${tag} tags are unbalanced (${openCount} open, ${closeCount} close)`);
}
if (failures.length) throw new Error(`Theme monetization validation failed: ${failures.join('; ')}`);
console.log('Validated Blogger theme: retired posts are filtered and approval-blocking widgets are disabled.');
