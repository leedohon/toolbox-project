# 툴박스 게시글 초안·릴리스 가이드

## 단일 원본

- 기능 정의와 입력 규칙: `toolbox/tools/<도구>.md`
- 도구별 상세 설명과 사용자 FAQ: `toolbox/post-content.json`
- 공통·도구별 해시태그와 Blogger 라벨: `toolbox/post-tags.json`
- 게시글 구조: `toolbox/templates/blogger-inline-tool-template.md`
- 게시글 외형: `assets/blogger/theme.css`
- 실행 도구 공통 외형: `assets/simple-tools.css`
- 모바일 포커스와 공통 UX: `assets/toolbox-ux.js`
- 버전 변경 목록: `outputs/<도구>/<버전>/patch-notes.json`
- 빠른 작업 경로 색인: `ai-index.json`, `toolbox/ai-index.json`, `embed/<도구>/ai-index.json`

새 도구 또는 통합 도구는 공개 진입점, 기능 모듈, 게시글 셸을 분리한다. 기존 전체 도구를 소급 재작성하지 않고 새 작업부터 점진적으로 적용한다. 은퇴 도구는 카탈로그에서만 제외하고 기존 URL·index·버전·공유 코드의 호환 진입점은 보존한다.

공통 HTML이나 CSS를 게시글마다 다시 작성하지 않는다. 기능은 `embed/<도구>/index.html`에서 개별 구현하고, 나머지 게시글 영역은 생성 스크립트로 만든다.

## 사용자용 글 구성

1. 제목, 한 줄 설명, 핵심 기능
2. 실행 iframe
3. 세 단계 사용 방법
4. 두 문단 이상의 상세 설명
5. 검색과 관련 도구 탐색을 돕는 해시태그
6. 실제 사용자 질문 네 개 이상의 FAQ
7. 최신순 누적 패치노트

FAQ에는 입력 형식, 결과 해석, 개인정보 처리, 모바일 사용, 오류 해결을 우선한다. 게시글 수정이나 배포 방식 같은 운영자용 질문은 넣지 않는다.

## 게시글 SEO

게시글을 새로 작성하거나 제목·리드·사용법·상세 설명·FAQ·태그를 수정할 때 `toolbox/seo-rules.json`을 읽는다. 기능 HTML만 바뀌는 릴리스에서는 SEO 문구를 억지로 추가하거나 Blogger 본문을 불필요하게 수정하지 않는다.

- 게시글마다 하나의 주 검색 의도를 정하고 제목과 리드에서 도구의 입력·결과·사용 이점을 바로 설명한다.
- H1은 도구 제목 한 번만 사용하고, H2는 실행 → 사용 방법 → 상세 설명 → FAQ → 패치노트 순서의 의미 있는 제목으로 유지한다.
- 주 키워드와 한글·영문 연관어는 문맥에 맞게 사용하며 반복·숨김·나열식 삽입을 금지한다.
- 상세 설명과 FAQ는 실제 사용법, 제한, 개인정보, 오류 해결을 보강하되 검색용 분량 채우기로 작성하지 않는다.
- 본문 해시태그, Blogger 라벨과 20~30개 검색어가 동일한 검색 의도를 가리키는지 확인한다.
- 관련 링크는 목적이 드러나는 문구를 사용하고 정보 이미지에는 의미 있는 대체 텍스트를 제공한다.

## 자동화 명령

새 버전 뼈대 생성:

```text
node scripts/create-tool-release.mjs <도구> <minimum|minor|major> --summary "요약" --change "변경 1" --change "변경 2"
```

공통 게시글 영역 생성과 카탈로그·릴리스 검증:

```text
node scripts/build-tool-posts.mjs <도구>
node scripts/ensure-embed-common-assets.mjs
node scripts/build-tool-catalog.mjs
node scripts/build-ai-index.mjs <도구>
node scripts/validate-tool-releases.mjs
node scripts/serve-local.mjs
```

로컬 서버 실행 후 `http://127.0.0.1:8765/toolbox/preview-post.html?tool=<도구>`에서 Blogger 공통 테마가 적용된 게시글을 확인한다.

여러 도구의 공통 콘텐츠를 바꿀 때 `<도구>`를 생략하면 전체 공개 도구를 갱신한다.

## 완료 기준

- 최신 릴리스 HTML에 상세 설명, 네 개 이상의 사용자 FAQ와 전체 패치 이력이 있다.
- 공통 문구는 중앙 콘텐츠와 템플릿에서 생성됐으며 게시글별 중복 CSS가 없다.
- 모바일과 PC에서 iframe, 긴 FAQ·패치 목록, 좌측 하단 복귀 버튼을 직접 확인했다.
- 모바일에서 초기화·항목 추가·오류·복사 실패 뒤 자동 포커스가 생기지 않고 데스크톱 키보드 흐름은 유지된다.
- 동일한 입력·결과와 조작 흐름을 가진 변환 기능은 별도 게시글보다 하나의 도구 안에서 형식을 선택하도록 통합됐는지 확인한다.
- 새 통합 도구는 하나의 공개 `embed/<tool>/` 진입점 아래 교체 가능한 기능 모듈을 두고, 은퇴 도구의 `status`, `replacementTool`, 기존 URL과 공유 코드 호환을 확인한다.
- 게시 제목은 `[초간단 툴박스] 도구명` 형식을 유지하고, 메인을 제외한 게시글·라벨 검색·검색 결과·보관함 등 모든 내부 화면에서 같은 Openworld Blog 소개·도구 검색 UI를 사용한다.
- 메인은 빈 검색에서도 기존 3열 도구 카드를 표시한다. 내부 화면만 빈 검색에서 링크를 숨기고, 입력 뒤에 JSON 카탈로그의 제목·설명·해시태그·20~30개 키워드에 일치하거나 유사한 도구 링크를 표시한다.
- `toolbox/post-tags.json`의 태그가 본문 링크와 Blogger 라벨에 동일하게 반영된다.
- `toolbox/seo-rules.json`에 따라 제목·리드·본문·FAQ·태그가 하나의 검색 의도를 자연스럽게 설명하고 키워드 반복, 숨김 텍스트와 중복 문구가 없다.
- 공통 상단 검색은 Blogger 검색 결과 목록의 DOM과 링크 동작을 대체하지 않는다. 전역 푸터는 중복 검색·프로필·보관함·태그·번역 위젯을 숨기고 출처 표기만 컴팩트하게 유지한다.
- `assets/blogger/theme.css`를 바꾸면 `assets/blogger/site.js`의 `themeRelease`도 함께 올려 Blogger의 이전 CSS 캐시가 남지 않게 한다.
- iframe 높이는 게시글 인라인 스크립트가 아니라 전역 `assets/blogger/site.js`가 조절한다. 새 도구는 실제 최대 모바일 높이를 고려한 fallback 높이도 함께 둔다.
- Blogger 수정, 카탈로그, 커밋·푸시와 공개 배포 검증을 완료했다.
