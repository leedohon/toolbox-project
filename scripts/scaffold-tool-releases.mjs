import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = process.argv[2];
if (!configPath) throw new Error('Usage: node scripts/scaffold-tool-releases.mjs <config.json>');
const config = JSON.parse(await fs.readFile(path.resolve(root, configPath), 'utf8'));
const date = config.releaseDate || new Date().toISOString().slice(0, 10);
const version = '0.0.1v';
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const write = async (file, value) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, value); };
const renderUiField = (field) => {
  const label = `<label class="st-label" for="${escape(field.id)}" data-ko="${escape(field.label)}" data-en="${escape(field.enLabel || field.label)}">${escape(field.label)}</label>`;
  if (field.type === 'textarea') return `<div class="st-field">${label}<textarea id="${escape(field.id)}" maxlength="${field.maxlength || 100000}" data-ko-placeholder="${escape(field.placeholder || '')}" data-en-placeholder="${escape(field.enPlaceholder || field.placeholder || '')}">${escape(field.value || '')}</textarea></div>`;
  if (field.type === 'select') return `<div class="st-field">${label}<select id="${escape(field.id)}">${field.options.map((option) => `<option value="${escape(option.value)}">${escape(option.label)} / ${escape(option.en || option.label)}</option>`).join('')}</select></div>`;
  const attributes = [`id="${escape(field.id)}"`, `type="${field.type === 'number' ? 'number' : 'text'}"`];
  for (const name of ['min', 'max', 'step']) if (field[name] !== undefined) attributes.push(`${name}="${escape(field[name])}"`);
  if (field.maxlength) attributes.push(`maxlength="${escape(field.maxlength)}"`);
  if (field.value !== undefined) attributes.push(`value="${escape(field.value)}"`);
  attributes.push(`data-ko-placeholder="${escape(field.placeholder || '')}"`, `data-en-placeholder="${escape(field.enPlaceholder || field.placeholder || '')}"`);
  return `<div class="st-field">${label}<input ${attributes.join(' ')}></div>`;
};
const renderGeneratedEmbed = (tool) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(tool.title)}</title>
<link rel="stylesheet" href="../../assets/simple-tools.css?v=0.1.1"><link rel="stylesheet" href="../../assets/generated-tools.css?v=0.1.0"><link rel="stylesheet" href="../../assets/toolbox-i18n.css?v=0.1.0"><script src="../../assets/toolbox-i18n.js?v=0.3.0"></script><script src="../../assets/toolbox-ux.js?v=0.1.0"></script></head><body>
<article class="simple-tool" aria-label="${escape(tool.title)}">${tool.ui.fields.map(renderUiField).join('')}<div class="st-actions"><button class="st-primary" id="sg-run" type="button" data-ko="${escape(tool.ui.runLabel || '실행')}" data-en="${escape(tool.ui.runEn || 'Run')}">${escape(tool.ui.runLabel || '실행')}</button><button class="st-secondary" id="sg-copy" type="button" data-ko="결과 복사" data-en="Copy result">결과 복사</button><button class="st-secondary" id="sg-reset" type="button" data-ko="초기화" data-en="Reset">초기화</button></div><p class="st-status" id="sg-status" aria-live="polite"></p><section class="st-result" id="sg-result" hidden><h2 data-ko="${escape(tool.ui.resultTitle || '결과')}" data-en="${escape(tool.ui.resultTitleEn || 'Result')}">${escape(tool.ui.resultTitle || '결과')}</h2><div id="sg-output"></div></section><textarea class="st-copy-fallback" id="sg-fallback" readonly hidden></textarea></article><script type="module" src="./tool.js?v=0.0.1"></script></body></html>
`;
const postContentPath = path.join(root, 'toolbox/post-content.json');
const postTagsPath = path.join(root, 'toolbox/post-tags.json');
const postContent = JSON.parse(await fs.readFile(postContentPath, 'utf8'));
const postTags = JSON.parse(await fs.readFile(postTagsPath, 'utf8'));

for (const tool of config.tools) {
  const rules = tool.rules || ['입력과 결과는 현재 브라우저 안에서만 처리한다.', '모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.'];
  const slug = tool.slug;
  const embedUrl = `https://leedohon.github.io/toolbox-project/embed/${slug}/`;
  const post = `<article id="toolbox-${slug}-post" class="tb-post">
  <header class="tb-hero"><p class="tb-label">초간단 툴박스</p><h1>${escape(tool.title)}</h1><p class="tb-lead">${escape(tool.description)}</p><ul class="tb-features">${tool.features.slice(0, 4).map((value) => `<li>${escape(value)}</li>`).join('')}</ul></header>
  <h2>${escape(tool.actionTitle)}</h2><div class="tb-frame"><iframe src="${embedUrl}" title="${escape(tool.title)}" id="toolbox-${slug}-frame" height="${tool.embedHeight || 1000}" loading="lazy" scrolling="no" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p class="tb-fallback">도구가 보이지 않으면 <a href="${embedUrl}" target="_blank" rel="noopener">새 창에서 열기</a>를 이용하세요.</p>
  <h2>사용 방법</h2><ol class="tb-steps">${tool.steps.map((value) => `<li>${escape(value)}</li>`).join('')}</ol>
  <!-- tb-tool-details:start --><section class="tb-tool-details"><h2>${escape(tool.title)} 상세 설명</h2><div class="tb-detail-copy"><p>${escape(tool.details[0])}</p><p>${escape(tool.details[1])}</p></div></section><!-- tb-tool-details:end -->
  <!-- tb-tags:start --><nav class="tb-tags" aria-label="관련 태그"></nav><!-- tb-tags:end -->
  <!-- tb-faq:start --><h2>자주 묻는 질문</h2>${tool.faq.map((item) => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join('')}<!-- tb-faq:end -->
  <!-- tb-patch-notes:start --><!-- tb-patch-notes:end -->
</article><script>(function(){var frame=document.getElementById('toolbox-${slug}-frame');window.addEventListener('message',function(event){if(event.origin!=='https://leedohon.github.io'||!event.data||event.data.source!=='toolbox-embed'||event.data.tool!=='${slug}')return;var height=Number(event.data.height);if(Number.isFinite(height)&&height>=320&&height<=3000)frame.style.height=Math.ceil(height)+'px';});}());</script>
`;
  const definition = `---
title: ${tool.title}
slug: ${slug}
type: ${tool.type}
description: ${tool.description}
status: published
inputs:
${tool.inputs.map((value) => `  - id: ${value.id}\n    label: ${value.label}\n    type: ${value.type}`).join('\n')}
---

## 기능

${tool.features.map((value) => `- ${value}`).join('\n')}

## 실행 규칙

${rules.map((value) => `- ${value}`).join('\n')}

## 호환성

- 기능은 고정 주소 \`embed/${slug}/\`와 독립 \`tool.js\` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
`;
  const release = { tool: slug, version, releaseDate: date, changeLevel: 'minimum', changes: tool.changes, qa: tool.qa };
  const manifest = { index: tool.index, tool: slug, title: tool.title, description: tool.description, postUrl: '', latestVersion: version, versions: [{ version, releaseDate: date, changeLevel: 'minimum', summary: tool.summary, directory: version, html: `${version}/${slug}.html`, patchNotes: `${version}/patch-notes.json` }] };
  await write(path.join(root, 'toolbox/tools', `${slug}.md`), definition);
  await write(path.join(root, 'toolbox/posts', `${slug}.html`), post);
  await write(path.join(root, 'outputs', slug, 'versions.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await write(path.join(root, 'outputs', slug, version, 'patch-notes.json'), `${JSON.stringify(release, null, 2)}\n`);
  await write(path.join(root, 'outputs', slug, version, `${slug}.html`), post);
  await write(path.join(root, 'embed', slug, 'modules.json'), `${JSON.stringify({ schemaVersion: 1, modules: [{ id: slug, label: { ko: tool.title, en: tool.englishTitle || slug }, entry: './tool.js', messageTool: slug, capabilities: { resultCode: false, png: false, copyFallback: true, i18n: true, responsive: true, browserOnly: true } }] }, null, 2)}\n`);
  if (tool.runtimePreset && tool.ui?.fields?.length) {
    await write(path.join(root, 'embed', slug, 'index.html'), renderGeneratedEmbed(tool));
    await write(path.join(root, 'embed', slug, 'tool.js'), `import {mountGeneratedTool} from '../../assets/generated-tool-runtime.js?v=0.1.0';\nmountGeneratedTool(${JSON.stringify({slug, preset: tool.runtimePreset, fields: tool.ui.fields.map((field) => field.id)}, null, 2)});\n`);
  }
  postContent[slug] = { detailTitle: `${tool.title} 상세 설명`, details: tool.details, faq: tool.faq };
  postTags.tools[slug] = tool.tags;
  postTags.keywords[slug] = tool.keywords;
}
await fs.writeFile(postContentPath, `${JSON.stringify(postContent, null, 2)}\n`);
await fs.writeFile(postTagsPath, `${JSON.stringify(postTags, null, 2)}\n`);
console.log(`Scaffolded ${config.tools.length} initial tool releases.`);
