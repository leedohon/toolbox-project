# 2026-07-23 공개 도구 일괄 통합

## 사용자 요청

- 공개 도구 전수 점검에서 단독 가치가 낮거나 입력·결과 구조가 겹치는 기능은 목적별 허브로 합친다.
- 합칠 대상과 은퇴·호환 처리, 게시글·카탈로그·배포를 나누지 않고 한 번에 처리한다.
- 기존 기능과 공개 주소는 끊지 않으며 공개 카탈로그의 선택 부담만 줄인다.

## 확정 통합표

| 유지할 공개 진입점 | 편입할 기존 도구 |
|---|---|
| `base64-tools` — 인코딩·문자 변환 도구 | `number-base-converter`, `unicode-inspector`, `html-entity-converter`, `roman-numeral-converter` |
| `date-calculator` — 다용도 계산기 | `unix-timestamp-converter`, `aspect-ratio-calculator`, `percentage-calculator`, `average-median-calculator` |
| `password-generator` — 비밀번호·UUID 생성기 | `uuid-generator` |
| `image-resizer-compressor` — 이미지 크기·압축·DPI 도구 | `dpi-ppi-calculator` |
| `color-converter-contrast` — CSS 디자인 도구 | `css-gradient-generator`, `css-clamp-calculator`, `css-box-shadow-generator`, `css-unit-converter`, `css-border-radius-generator` |
| `text-counter-cleaner` — 텍스트 정리·생성 도구 | `filename-sanitizer`, `lorem-ipsum-generator`, `slug-generator`, `line-sort-deduplicator` |
| `markdown-preview-converter` — 마크다운 작성 도구 | `markdown-table-generator` |
| `http-status-lookup` — 개발자 빠른 참조·검사 도구 | `chmod-calculator`, `cron-expression-explainer`, `mime-type-lookup`, `isbn-validator` |

## 구현 규칙

- 공개 카드 수는 43개에서 19개로 줄인다.
- 허브는 모드 선택과 내부 높이 동기화만 담당하고, 기존 기능 엔진은 독립 모듈로 유지한다.
- 선택지가 4개 이하면 라디오, 5개 이상이면 셀렉트를 사용한다.
- 모바일·데스크톱 모두 기능 영역을 한 열로 표시하고 내부 이중 스크롤과 가로 넘침을 허용하지 않는다.
- 각 기능의 KOR / ENG, 복사 대체 처리, 기존 결과와 독립 주소를 보존한다.
- 편입 도구는 `status: retired`와 `replacementTool`을 기록해 공개 카탈로그에서 제외한다.
- 은퇴 도구의 기존 Blogger 게시글과 iframe 주소는 삭제하지 않고 새 허브 안내 및 호환 진입점으로 유지한다.
- ISBN 검사는 단독 공개 페이지는 정리하되 개발자 빠른 참조 도구의 검사 모드로 보존한다.

## 릴리스·게시

- 허브 기능 개편은 `major`, 은퇴·호환 전환은 `minor` 릴리스로 기록한다.
- 허브 게시글은 새 제목·상세 설명·FAQ·전체 패치노트를 반영한다.
- 은퇴 게시글은 실제 `replacementTool`의 제목과 링크를 사용해 갱신한다.
- 카탈로그, AI 색인, Blogger 기존 글, Git `main`, GitHub Pages를 같은 실행에서 동기화한다.

## 검증

- 모듈 계약, 버전 경로, JSON, 카탈로그 고유 index와 최신 버전 일치를 검사한다.
- 375×812과 1280×900에서 모드 선택, 기능 실행, 오류 상태, 높이 증가·감소, 가로 넘침과 이중 스크롤을 확인한다.
- `IFRAME_HEIGHT_STALE`, `HIDDEN_GRID_OVERRIDE`, `SHARED_ASSET_CACHE_STALE`, `RETIRED_POST_COPY_LEAK`, `PORTRAIT_LONG_TEXT_SQUEEZE` 회귀 항목을 적용한다.

## 실행 설정

- 작업 종류: 공개 도구 일괄 통합
- 대상 도구: 위 통합표의 8개 허브와 24개 편입 도구
- 버전 단계: 허브 `major`, 편입 도구 `minor`
- Blogger 게시: 기존 공개 글 수정
- Git·배포: `main` 커밋·푸시와 GitHub Pages 확인
- 종료 예약: 사용하지 않음
