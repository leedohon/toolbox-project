import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputs = path.join(root, 'outputs');
const posts = path.join(root, 'toolbox', 'posts');
const [replacementTool, ...retiredTools] = process.argv.slice(2);
if (!replacementTool || !retiredTools.length) throw new Error('Usage: node scripts/build-retired-tool-posts.mjs <replacement-tool> <retired-tool...>');
const replacement = JSON.parse(await fs.readFile(path.join(outputs, replacementTool, 'versions.json'), 'utf8'));
if (!replacement.postUrl) throw new Error(`${replacementTool}: published postUrl is required`);

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
for (const tool of retiredTools) {
  const manifest = JSON.parse(await fs.readFile(path.join(outputs, tool, 'versions.json'), 'utf8'));
  if (manifest.status !== 'retired' || manifest.replacementTool !== replacementTool) throw new Error(`${tool}: retirement metadata is incomplete`);
  const legacyTitle = manifest.legacyTitle || manifest.title.replace(/ 통합 안내$/, '');
  const isGameReplacement = replacementTool === 'multipurpose-draw-game';
  const category = replacement.category || (isGameReplacement ? '다용도 펀박스' : '초간단 툴박스');
  const lead = isGameReplacement
    ? `기존 기능은 한곳에서 더 편하게 선택할 수 있습니다. 아래 새 게시글에서 ${legacyTitle} 모드를 이용하세요.`
    : `기존 ${legacyTitle} 기능은 ${replacement.title}에서 계속 사용할 수 있습니다. 기존 주소는 호환 안내로 유지됩니다.`;
  const features = isGameReplacement
    ? ['기존 결과 코드 호환', '네 가지 게임을 한 화면에서 선택', 'PNG 저장 · KOR / ENG']
    : ['기존 공개 주소 유지', '핵심 입력·결과 계속 제공', 'KOR / ENG 지원'];
  const steps = isGameReplacement
    ? ['새 통합 게시글을 엽니다.', `${legacyTitle} 모드를 선택합니다.`, '기존처럼 입력하거나 받은 결과 코드를 붙여 넣습니다.']
    : ['새 통합 게시글을 엽니다.', `${replacement.title}에서 관련 기능을 선택합니다.`, '기존처럼 입력하고 변환 결과를 확인합니다.'];
  const details = isGameReplacement
    ? [`${legacyTitle}의 입력, 추첨, 결과 코드 복원과 PNG 저장 기능은 다용도 뽑기게임의 같은 이름 모드에서 계속 제공됩니다.`, '기존 게시글 주소와 공유 코드는 호환을 위해 유지하며, 새 기능과 안내는 통합 게시글을 기준으로 갱신합니다.']
    : [`${legacyTitle}의 핵심 입력과 결과 기능은 ${replacement.title}에서 계속 제공됩니다.`, '기존 게시글과 실행 주소는 호환 안내로 유지하며 새 기능과 안내는 통합 도구를 기준으로 갱신합니다.'];
  const faq = isGameReplacement
    ? [
        ['기존 기능이 삭제된 건가요?', '아니요. 같은 기능을 다용도 뽑기게임 안에서 계속 사용할 수 있습니다.'],
        ['예전에 받은 결과 코드도 열 수 있나요?', `네. 새 도구에서 ${legacyTitle} 모드를 선택한 뒤 기존 코드를 붙여 넣으세요.`],
        ['입력한 내용이 서버에 저장되나요?', '아니요. 입력과 결과 처리는 현재 브라우저 안에서 실행됩니다.'],
        ['휴대폰에서도 사용할 수 있나요?', '네. 새 통합 도구는 PC와 모바일에서 같은 기능을 제공합니다.']
      ]
    : [
        ['기존 기능이 삭제된 건가요?', `아니요. 같은 핵심 기능을 ${replacement.title}에서 계속 사용할 수 있습니다.`],
        ['기존 주소로 접속해도 되나요?', '네. 기존 주소는 새 통합 도구를 안내하는 호환 진입점으로 유지됩니다.'],
        ['입력한 내용이 서버에 저장되나요?', '아니요. 입력과 결과 처리는 현재 브라우저 안에서 실행됩니다.'],
        ['휴대폰에서도 사용할 수 있나요?', '네. 새 통합 도구는 PC와 모바일에서 같은 기능을 제공합니다.']
      ];
  const html = `<!-- Blogger 호환 안내 게시글 -->
<article id="toolbox-${escapeHtml(tool)}-post" class="tb-post tb-retired-post">
  <header class="tb-hero"><p class="tb-label">${escapeHtml(category)}</p><h1>${escapeHtml(legacyTitle)} 기능이 ${escapeHtml(replacement.title)}로 통합되었습니다</h1><p class="tb-lead">${escapeHtml(lead)}</p><ul class="tb-features">${features.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></header>
  <h2>새 통합 도구 열기</h2><p class="tb-fallback"><a href="${escapeHtml(replacement.postUrl)}">[${escapeHtml(category)}] ${escapeHtml(replacement.title)} 게시글로 이동</a></p>
  <p class="tb-fallback">게시글이 열리지 않으면 <a href="https://leedohon.github.io/toolbox-project/embed/${escapeHtml(replacementTool)}/" target="_blank" rel="noopener">새 창에서 ${escapeHtml(replacement.title)} 열기</a>를 이용하세요.</p>
  <h2>이용 안내</h2><ol class="tb-steps">${steps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
  <!-- tb-tool-details:start --><section class="tb-tool-details"><h2>통합 안내 상세 설명</h2><div class="tb-detail-copy">${details.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}</div></section><!-- tb-tool-details:end -->
  <!-- tb-tags:start --><nav class="tb-tags" aria-label="관련 태그"><a href="/search/label/${encodeURIComponent('다용도펀박스')}" rel="tag">#다용도펀박스</a><a href="/search/label/${encodeURIComponent('다용도뽑기게임')}" rel="tag">#다용도뽑기게임</a><a href="/search/label/${encodeURIComponent('랜덤게임')}" rel="tag">#랜덤게임</a><a href="/search/label/${encodeURIComponent(legacyTitle)}" rel="tag">#${escapeHtml(legacyTitle)}</a></nav><!-- tb-tags:end -->
  <!-- tb-faq:start --><h2>자주 묻는 질문</h2>${faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}<!-- tb-faq:end -->
  <!-- tb-patch-notes:start --><details class="tb-patch-notes"><summary>패치노트</summary><div class="tb-patch-list">통합 안내 릴리스가 표시됩니다.</div></details><!-- tb-patch-notes:end -->
</article>
`;
  await fs.writeFile(path.join(posts, `${tool}.html`), html);
  console.log(`Built retired compatibility post: ${tool} -> ${replacementTool}`);
}
