import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'toolbox', 'posts');
const contentPath = path.join(root, 'toolbox', 'post-content.json');
const valueContentPath = path.join(root, 'toolbox', 'post-value-content.json');
const tagsPath = path.join(root, 'toolbox', 'post-tags.json');
const detailStart = '<!-- tb-tool-details:start -->';
const detailEnd = '<!-- tb-tool-details:end -->';
const tagsStart = '<!-- tb-tags:start -->';
const tagsEnd = '<!-- tb-tags:end -->';
const workedExamplesStart = '<!-- tb-worked-examples:start -->';
const workedExamplesEnd = '<!-- tb-worked-examples:end -->';
const resultGuideStart = '<!-- tb-result-guide:start -->';
const resultGuideEnd = '<!-- tb-result-guide:end -->';
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

function renderWorkedExamples(tool, valueContent) {
  if (!Array.isArray(valueContent.workedExamples) || valueContent.workedExamples.length < 2) {
    throw new Error(`${tool}: at least two worked examples are required.`);
  }
  const items = valueContent.workedExamples.map((example, index) => {
    if (!example || !String(example.title || '').trim() || !String(example.input || '').trim() || !String(example.result || '').trim()) {
      throw new Error(`${tool}: worked example ${index + 1} requires title, input, and result.`);
    }
    return `<article class="tb-example-card"><h3>${escapeHtml(example.title)}</h3><dl><div><dt>입력</dt><dd>${escapeHtml(example.input)}</dd></div><div><dt>결과</dt><dd>${escapeHtml(example.result)}</dd></div></dl></article>`;
  }).join('');
  return `${workedExamplesStart}<section class="tb-worked-examples"><h2>활용 예시</h2><div class="tb-worked-example-list">${items}</div></section>${workedExamplesEnd}`;
}

function renderResultGuide(tool, valueContent) {
  if (!Array.isArray(valueContent.limitations) || valueContent.limitations.length < 2) {
    throw new Error(`${tool}: at least two result limitations are required.`);
  }
  const items = valueContent.limitations.map((limitation, index) => {
    if (!String(limitation || '').trim()) {
      throw new Error(`${tool}: result limitation ${index + 1} must not be empty.`);
    }
    return `<li class="tb-result-guide-item">${escapeHtml(limitation)}</li>`;
  }).join('');
  return `${resultGuideStart}<section class="tb-result-guide"><h2>결과 확인 전 알아두기</h2><ul>${items}</ul></section>${resultGuideEnd}`;
}

function renderFaq(content) {
  if (!Array.isArray(content.faq) || content.faq.length < 4) throw new Error('At least four user FAQs are required.');
  const items = content.faq.map((item) => {
    if (!item.question || !item.answer) throw new Error('FAQ question and answer are required.');
    return `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`;
  }).join('');
  return `${faqStart}<h2>자주 묻는 질문</h2>${items}${faqEnd}`;
}

function renderTags(tool, tagsDocument) {
  const tags = [...new Set([...(tagsDocument.common || []), ...(tagsDocument.tools?.[tool] || [])])];
  if (tags.length < 4 || tags.length > 10) throw new Error(`${tool}: 4~10개의 해시태그가 필요합니다.`);
  const links = tags.map((tag) => `<a href="/search/label/${encodeURIComponent(tag)}" rel="tag">#${escapeHtml(tag)}</a>`).join('');
  return `${tagsStart}<nav class="tb-tags" aria-label="관련 태그">${links}</nav>${tagsEnd}`;
}

function injectGeneratedContent(html, details, tags, workedExamples, resultGuide, faq, tool) {
  const detailPattern = new RegExp(`${detailStart}[\\s\\S]*?${detailEnd}`);
  const tagsPattern = new RegExp(`${tagsStart}[\\s\\S]*?${tagsEnd}`);
  const workedExamplesPattern = new RegExp(`${workedExamplesStart}[\\s\\S]*?${workedExamplesEnd}`);
  const resultGuidePattern = new RegExp(`${resultGuideStart}[\\s\\S]*?${resultGuideEnd}`);
  const faqPattern = new RegExp(`${faqStart}[\\s\\S]*?${faqEnd}`);
  if (detailPattern.test(html) && faqPattern.test(html)) {
    const withDetails = html.replace(detailPattern, details);
    const withTags = tagsPattern.test(withDetails) ? withDetails.replace(tagsPattern, tags) : withDetails.replace(faqStart, `${tags}\n  ${faqStart}`);
    const withWorkedExamples = !workedExamples ? withTags : workedExamplesPattern.test(withTags)
      ? withTags.replace(workedExamplesPattern, workedExamples)
      : withTags.replace(faqStart, `${workedExamples}\n  ${faqStart}`);
    const withResultGuide = !resultGuide ? withWorkedExamples : resultGuidePattern.test(withWorkedExamples)
      ? withWorkedExamples.replace(resultGuidePattern, resultGuide)
      : withWorkedExamples.replace(faqStart, `${resultGuide}\n  ${faqStart}`);
    return withResultGuide.replace(faqPattern, faq);
  }

  const faqHeading = '<h2>자주 묻는 질문</h2>';
  const start = html.indexOf(faqHeading);
  const patch = html.indexOf(patchStart);
  const end = patch >= 0 ? patch : html.lastIndexOf('</article>');
  if (start < 0 || end < start) throw new Error(`${tool}: FAQ insertion point is missing`);
  const valueSections = [workedExamples, resultGuide].filter(Boolean).join('\n  ');
  return `${html.slice(0, start)}${details}\n  ${tags}${valueSections ? `\n  ${valueSections}` : ''}\n  ${faq}\n  ${html.slice(end)}`;
}

export async function buildToolPostContent(toolNames = []) {
  const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
  const valueContent = JSON.parse(await fs.readFile(valueContentPath, 'utf8'));
  const tagsDocument = JSON.parse(await fs.readFile(tagsPath, 'utf8'));
  const tools = toolNames.length ? toolNames : (await Promise.all(Object.keys(content).map(async (tool) => {
    try {
      const manifest = JSON.parse(await fs.readFile(path.join(root, 'outputs', tool, 'versions.json'), 'utf8'));
      return manifest.status === 'retired' ? null : tool;
    } catch (error) {
      if (error.code === 'ENOENT') return tool;
      throw error;
    }
  }))).filter(Boolean);
  const built = [];
  for (const tool of tools) {
    if (!content[tool]) throw new Error(`${tool}: post content is missing`);
    const manifestPath = path.join(root, 'outputs', tool, 'versions.json');
    let manifest = null;
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const requiresValueContent = manifest?.status !== 'retired' && Boolean(manifest?.postUrl);
    if (requiresValueContent && !valueContent[tool]) throw new Error(`${tool}: published post value content is missing`);
    const toolValueContent = valueContent[tool] || null;
    const postPath = path.join(postsDir, `${tool}.html`);
    const html = await fs.readFile(postPath, 'utf8');
    const updated = injectGeneratedContent(
      html,
      renderDetails(content[tool]),
      renderTags(tool, tagsDocument),
      toolValueContent ? renderWorkedExamples(tool, toolValueContent) : '',
      toolValueContent ? renderResultGuide(tool, toolValueContent) : '',
      renderFaq(content[tool]),
      tool,
    );
    await fs.writeFile(postPath, updated);
    built.push(tool);
  }
  return built;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const built = await buildToolPostContent(process.argv.slice(2));
  console.log(`Updated details, value guidance, and user FAQs for ${built.length} tools.`);
}
