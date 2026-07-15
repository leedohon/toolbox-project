import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'toolbox', 'posts');
const contentPath = path.join(root, 'toolbox', 'post-content.json');
const detailStart = '<!-- tb-tool-details:start -->';
const detailEnd = '<!-- tb-tool-details:end -->';
const faqStart = '<!-- tb-faq:start -->';
const faqEnd = '<!-- tb-faq:end -->';
const patchStart = '<!-- tb-patch-notes:start -->';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function renderDetails(content) {
  if (!content.detailTitle || !Array.isArray(content.details) || content.details.length < 2) {
    throw new Error('A detail title and at least two detail paragraphs are required.');
  }
  return `${detailStart}<section class="tb-tool-details"><h2>${escapeHtml(content.detailTitle)}</h2><div class="tb-detail-copy">${content.details.map((text) => `<p>${escapeHtml(text)}</p>`).join('')}</div></section>${detailEnd}`;
}
function renderFaq(content) {
  if (!Array.isArray(content.faq) || content.faq.length < 4) throw new Error('At least four user FAQs are required.');
  const items = content.faq.map((item) => {
    if (!item.question || !item.answer) throw new Error('FAQ question and answer are required.');
    return `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`;
  }).join('');
  return `${faqStart}<h2>자주 묻는 질문</h2>${items}${faqEnd}`;
}

function injectGeneratedContent(html, details, faq, tool) {
  const detailPattern = new RegExp(`${detailStart}[\\s\\S]*?${detailEnd}`);
  const faqPattern = new RegExp(`${faqStart}[\\s\\S]*?${faqEnd}`);
  if (detailPattern.test(html) && faqPattern.test(html)) {
    return html.replace(detailPattern, details).replace(faqPattern, faq);
  }

  const faqHeading = '<h2>자주 묻는 질문</h2>';
  const start = html.indexOf(faqHeading);
  const patch = html.indexOf(patchStart);
  const end = patch >= 0 ? patch : html.lastIndexOf('</article>');
  if (start < 0 || end < start) throw new Error(`${tool}: FAQ insertion point is missing`);
  return `${html.slice(0, start)}${details}\n  ${faq}\n  ${html.slice(end)}`;
}

export async function buildToolPostContent(toolNames = []) {
  const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
  const tools = toolNames.length ? toolNames : Object.keys(content);
  const built = [];
  for (const tool of tools) {
    if (!content[tool]) throw new Error(`${tool}: post content is missing`);
    const postPath = path.join(postsDir, `${tool}.html`);
    const html = await fs.readFile(postPath, 'utf8');
    const updated = injectGeneratedContent(html, renderDetails(content[tool]), renderFaq(content[tool]), tool);
    await fs.writeFile(postPath, updated);
    built.push(tool);
  }
  return built;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const built = await buildToolPostContent(process.argv.slice(2));
  console.log(`Updated details and user FAQs for ${built.length} tools.`);
}
