import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const writeReport = process.argv.includes('--write');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'outputs', 'tools.json'), 'utf8'));
const hubRuntime = await fs.readFile(path.join(root, 'assets', 'tool-hub.js'), 'utf8').catch((error) => {
  if (error.code === 'ENOENT') return '';
  throw error;
});
const rows = [];

for (const item of catalog.tools) {
  const manifestPath = path.join(root, 'outputs', item.tool, 'versions.json');
  const embedPath = path.join(root, 'embed', item.tool, 'index.html');
  const toolScriptPath = path.join(root, 'embed', item.tool, 'tool.js');
  const modulesPath = path.join(root, 'embed', item.tool, 'modules.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const html = await fs.readFile(embedPath, 'utf8');
  const toolScript = await fs.readFile(toolScriptPath, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return '';
    throw error;
  });
  const runtimeSource = `${html}\n${toolScript}`;
  const modules = await fs.readFile(modulesPath, 'utf8').then(JSON.parse).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  const checks = {
    catalogVersion: item.version === manifest.latestVersion,
    published: (manifest.status || 'published') === 'published',
    postUrl: /^https:\/\//.test(manifest.postUrl || ''),
    title: /<title>[^<]+<\/title>/i.test(html),
    viewport: /name=["']viewport["']/i.test(html),
    i18n: html.includes('toolbox-i18n.js') && html.includes('toolbox-i18n.css'),
    safeUx: html.includes('toolbox-ux.js') && !/\bautofocus\b/i.test(html),
    heightSync: /setupEmbedHeight|mountGeneratedTool|source\s*:\s*["']toolbox-embed["']|location\.replace/.test(runtimeSource)
      || (html.includes('tool-hub.js') && /setupEmbedHeight/.test(hubRuntime)),
    hiddenGuard: !/\[hidden\][^{]*\{[^}]*display\s*:\s*(?:grid|flex)(?![^}]*!important)/i.test(html),
    moduleContract: modules
      ? Array.isArray(modules.modules) && modules.modules.length > 0 && modules.modules.every((module) => module.entry && module.capabilities?.i18n)
      : /<script\b/i.test(html)
  };
  const editableTextareas = [...html.matchAll(/<textarea\b[^>]*>/gi)].filter((match) => !/\breadonly\b/i.test(match[0]));
  checks.longTextLayout = editableTextareas.length < 2 || html.includes('wf-longtext-stack');
  const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
  rows.push({index: item.index, tool: item.tool, version: item.version, checks, failed});
}

const result = {
  auditedAt: new Date().toISOString(),
  publicCount: rows.length,
  passed: rows.filter((row) => row.failed.length === 0).length,
  failed: rows.filter((row) => row.failed.length > 0).length,
  rows
};

if (writeReport) {
  const lines = [
    '# 2026-07-19 공개 모듈 전수조사',
    '',
    `- 공개 카탈로그: ${result.publicCount}개`,
    `- 구조 검사 통과: ${result.passed}개`,
    `- 구조 검사 보완 필요: ${result.failed}개`,
    '- 검사 항목: 최신 버전, 공개 상태, 게시글 주소, 문서 제목, viewport, KOR / ENG, 안전 포커스, iframe 높이, hidden 상태, 모듈 계약, 장문 입력 배치',
    '',
    '| # | 도구 | 버전 | 구조 검사 |',
    '|---:|---|---:|---|',
    ...rows.map((row) => `| ${row.index} | \`${row.tool}\` | ${row.version} | ${row.failed.length ? `보완: ${row.failed.join(', ')}` : '통과'} |`),
    '',
    '## 공개 화면 사전 검사',
    '',
    '- 2026-07-19 공개 GitHub Pages에서 기존 28개 도구를 375×812와 1280×900으로 직접 열었다.',
    '- 전체 도구에서 문서 가로 넘침, hidden 상태 누출, 작은 주요 버튼, 초기 자동 포커스와 콘솔 오류가 없었다.',
    '- 모바일 첫 순회의 `text-counter-cleaner`, `data-size-converter` 탐색 지연은 재시도에서 정상 로딩되어 기능 실패에서 제외했다.',
    '- `unicode-inspector`의 넓은 표는 문서 폭이 아니라 지정된 표 래퍼 내부에서만 가로 스크롤되는 것을 확인했다.',
    '- `text-diff-checker`의 데스크톱 두 입력은 각각 466px 좌우 배치로 측정되어 이번 개선 대상으로 확정했다.',
    '',
    '## 확정된 개선',
    '',
    '- 장문 입력 위/아래 고정: `text-diff-checker`, `markdown-preview-converter`',
    '- 문서 제목: `qr-barcode-generator`, `json-tools`',
    '- 직접 입력 5MB 제한: `json-tools`',
    '- 모바일 복사 대체 강제 선택 제거: `base64-tools`',
    '- 넓은 표 키보드 접근: `unicode-inspector`',
    '- 데이터 단위 통합: `data-size-converter` → `date-calculator`',
    '- 신규 공개: `xml-formatter-validator`, `url-parser-builder`',
    '',
    '## 배포 후 재검사',
    '',
    '- GitHub Pages 실행 `29656055345`와 카탈로그 실행 `29656055719`가 성공했다.',
    '- 변경 대상 10개는 375×812와 1280×900에서 오른쪽 가로 넘침, hidden 상태 누출, 콘솔 오류가 없었다.',
    '- `text-diff-checker` 두 입력은 데스크톱에서 같은 left 위치와 946px 전체 폭, 모바일에서 같은 left 위치와 317px 전체 폭을 사용했다.',
    '- 모바일 초기 상태에서 입력 자동 포커스가 없고 `data-size-converter` 기존 주소가 `date-calculator/?mode=data`로 이동했다.',
    '- XML 정상·태그 불일치 오류·정리 결과, URL 빈 반복 행 표시·행 추가·쿼리 재구성, 데이터 단위 9개 결과 표를 확인했다.',
    '- 신규 Blogger 게시글 2개는 H1, iframe, 상세 설명, FAQ 4개 이상, 누적 패치노트와 오른쪽 가로 넘침 없음이 확인됐다.'
  ];
  await fs.writeFile(path.join(root, 'toolbox', 'quality', 'public-module-audit-2026-07-19.md'), `${lines.join('\n')}\n`);
}

console.log(JSON.stringify({publicCount: result.publicCount, passed: result.passed, failed: rows.filter((row) => row.failed.length).map((row) => ({tool: row.tool, failed: row.failed}))}, null, 2));
if (result.failed) process.exitCode = 1;
