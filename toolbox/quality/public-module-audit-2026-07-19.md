# 2026-07-19 공개 모듈 전수조사

- 공개 카탈로그: 29개
- 구조 검사 통과: 29개
- 구조 검사 보완 필요: 0개
- 검사 항목: 최신 버전, 공개 상태, 게시글 주소, 문서 제목, viewport, KOR / ENG, 안전 포커스, iframe 높이, hidden 상태, 모듈 계약, 장문 입력 배치

| # | 도구 | 버전 | 구조 검사 |
|---:|---|---:|---|
| 1 | `qr-barcode-generator` | 0.5.5v | 통과 |
| 2 | `json-tools` | 0.7.1v | 통과 |
| 3 | `base64-tools` | 0.9.3v | 통과 |
| 8 | `image-mosaic-tool` | 0.2.4v | 통과 |
| 10 | `date-calculator` | 1.1.0v | 통과 |
| 11 | `multipurpose-draw-game` | 0.1.0v | 통과 |
| 12 | `password-generator` | 0.0.3v | 통과 |
| 13 | `image-resizer-compressor` | 0.0.3v | 통과 |
| 14 | `color-converter-contrast` | 0.0.3v | 통과 |
| 15 | `unix-timestamp-converter` | 0.0.3v | 통과 |
| 16 | `text-counter-cleaner` | 0.0.3v | 통과 |
| 17 | `text-diff-checker` | 0.0.3v | 통과 |
| 18 | `markdown-preview-converter` | 0.0.3v | 통과 |
| 19 | `csv-table-converter` | 0.0.2v | 통과 |
| 20 | `uuid-generator` | 0.0.2v | 통과 |
| 21 | `css-gradient-generator` | 0.0.2v | 통과 |
| 22 | `regex-tester` | 0.0.1v | 통과 |
| 23 | `aspect-ratio-calculator` | 0.0.1v | 통과 |
| 24 | `hash-generator` | 0.0.1v | 통과 |
| 25 | `number-base-converter` | 0.0.1v | 통과 |
| 26 | `filename-sanitizer` | 0.0.1v | 통과 |
| 27 | `lorem-ipsum-generator` | 0.0.1v | 통과 |
| 28 | `css-clamp-calculator` | 0.0.1v | 통과 |
| 29 | `unicode-inspector` | 0.0.2v | 통과 |
| 30 | `jwt-decoder` | 0.0.1v | 통과 |
| 32 | `dpi-ppi-calculator` | 0.0.1v | 통과 |
| 33 | `css-box-shadow-generator` | 0.0.1v | 통과 |
| 34 | `xml-formatter-validator` | 0.0.1v | 통과 |
| 35 | `url-parser-builder` | 0.0.1v | 통과 |

## 공개 화면 사전 검사

- 2026-07-19 공개 GitHub Pages에서 기존 28개 도구를 375×812와 1280×900으로 직접 열었다.
- 전체 도구에서 문서 가로 넘침, hidden 상태 누출, 작은 주요 버튼, 초기 자동 포커스와 콘솔 오류가 없었다.
- 모바일 첫 순회의 `text-counter-cleaner`, `data-size-converter` 탐색 지연은 재시도에서 정상 로딩되어 기능 실패에서 제외했다.
- `unicode-inspector`의 넓은 표는 문서 폭이 아니라 지정된 표 래퍼 내부에서만 가로 스크롤되는 것을 확인했다.
- `text-diff-checker`의 데스크톱 두 입력은 각각 466px 좌우 배치로 측정되어 이번 개선 대상으로 확정했다.

## 확정된 개선

- 장문 입력 위/아래 고정: `text-diff-checker`, `markdown-preview-converter`
- 문서 제목: `qr-barcode-generator`, `json-tools`
- 직접 입력 5MB 제한: `json-tools`
- 모바일 복사 대체 강제 선택 제거: `base64-tools`
- 넓은 표 키보드 접근: `unicode-inspector`
- 데이터 단위 통합: `data-size-converter` → `date-calculator`
- 신규 공개: `xml-formatter-validator`, `url-parser-builder`

## 배포 후 재검사

- 배포 완료 뒤 같은 모바일·데스크톱 기준과 핵심 입력 흐름으로 다시 검사한다.
