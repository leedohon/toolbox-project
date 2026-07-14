# Toolbox 하위 프로젝트 작업 기준

## 소속과 목표

- 상위 프로젝트: `blogger`
- 하위 프로젝트: `toolbox`
- 목표: 블로그 방문자가 즉시 쓸 수 있는 작고 가벼운 도구를 제공한다.

## 반드시 지킬 원칙

1. 한 게시글은 하나의 도구와 그 도구에 필요한 안내에만 집중한다.
2. 도구는 가입·설치·별도 웹사이트 방문 없이 Blogger 게시글 안에서 바로 실행되어야 한다.
3. 게시글 원고는 Blogger의 **HTML 보기**에 전체를 복사·붙여 넣을 수 있는 HTML 조각으로 작성한다.
4. 모든 외부 스크립트·리소스는 HTTPS로 불러온다.
5. JavaScript와 CSS는 해당 도구의 고유 ID 범위 안에서만 동작하게 작성해, 다른 게시글·테마와 충돌하지 않게 한다.
6. 복잡한 서버 처리 또는 대용량 파일 처리가 꼭 필요한 경우에만 별도 도메인·iframe 방식을 검토한다.

## 게시글 기본 구성

모든 도구 게시글은 아래 순서를 따른다.

1. 도구 제목
2. 한두 문장의 설명
3. 핵심 기능 안내
4. 실제 실행 도구
5. 사용 방법
6. FAQ

새 도구를 만들 때는 `toolbox/templates/blogger-inline-tool-template.md`를 기본 템플릿으로 사용한다. QR · 바코드 생성기는 이 템플릿의 첫 기준 구현이다.

## 인터페이스 기준

- 화이트·밝은 스카이블루 톤을 기본으로 한다. 공통 색상·버튼·입력 CSS는 `toolbox/styles/base.css`를 우선 재사용한다.
- 기본 동작은 흰 글자가 선명하게 보이는 스카이블루 가로 버튼, 취소·되돌리기는 흰 배경과 검정 글자 버튼을 사용한다.
- 버튼의 둥근 모서리는 약 `0.5rem`으로 유지한다.
- 연속값은 가로 슬라이더로 조절하고 현재 값을 표시한다.
- 선택지 4개 이하는 라디오 버튼, 5개 이상은 콤보박스를 사용한다.
- 모바일과 PC에서 모두 같은 핵심 기능이 작동해야 한다.
- 파일 입력이 필요한 도구는 파일 선택과 드래그 앤 드롭을 함께 제공한다.
- 입력값 변화만으로 결과를 안전하게 계산할 수 있는 도구는 별도의 실행 버튼 없이 자동으로 결과를 갱신한다.

## 파일 구성

- `toolbox/tools/`: 도구 정의와 입력 규칙
- `toolbox/posts/`: 블로그 게시글 원본
- `toolbox/templates/`: 새 도구 게시글을 만들 때 참조하는 기본 템플릿
- `outputs/<도구명>/<버전>/`: Blogger에 복사할 최종 HTML과 버전별 `patch-notes.json`

## 결과물 버전 관리

- 버전 형식은 `[major].[minor].[minimum]v`이며 최초 버전은 `0.0.1v`다.
- 간단한 수정은 `minimum`, 크지 않은 기능 변경은 `minor`, 기능 개편 수준은 `major`를 증가시킨다.
- `minimum` 증가 시 마지막 숫자만 올린다. `minor` 증가 시 `minimum`을 0으로, `major` 증가 시 `minor`와 `minimum`을 0으로 초기화한다.
- 버전 업데이트 시 이전 버전은 수정하지 않고 새 버전 폴더에 HTML과 `patch-notes.json`을 생성한다.
- `patch-notes.json`에는 `tool`, `version`, `releaseDate`, `changeLevel`, `changes`를 기록한다.
- 각 도구 폴더 바로 아래의 `versions.json`에는 `tool`, `latestVersion`, `versions`를 기록한다.
- `versions`의 각 항목에는 `version`, `releaseDate`, `changeLevel`, `summary`, `directory`, `html`, `patchNotes`를 기록한다.
- 새 버전을 생성할 때 `versions.json`에 새 항목을 추가하고 `latestVersion`을 갱신한다.
