# Blogger 게시 운영 및 자동화 기준

## 목적

이 문서는 도구 게시글을 만들고 Blogger에 게시한 뒤 GitHub Pages 기능과 메인 카탈로그까지 연결하는 전체 운영 기준을 정의한다. 특정 담당자에게 커밋이나 게시를 고정 배정하지 않고, 작업을 수행하는 에이전트가 권한과 실행 환경이 허용하는 범위에서 처음부터 끝까지 처리하는 것을 기본값으로 한다.

## 현재 운영 대상

- 블로그명: 오픈월드 툴박스
- 공개 주소: `https://bloggiedh.blogspot.com`
- Blogger 블로그 ID: `2198164223054760451`
- GitHub Pages: `https://leedohon.github.io/toolbox-project/`
- Git 기본 브랜치: `main`

블로그 ID와 공개 주소는 비밀값이 아니다. OAuth 클라이언트 비밀값과 토큰은 별도로 보호한다.

## 자동화 책임 범위

프로젝트 작업을 맡은 에이전트는 요청 범위에 포함된 경우 다음 작업을 연속해서 처리한다.

1. 도구 정의와 게시글 원본 작성
2. 새 버전 폴더, 완성형 HTML, 패치 노트, 버전 목록 갱신
3. 최신 iframe 기능 갱신과 모바일·PC 동작 검증
4. Blogger 게시글 조회, 신규 작성, 기존 글 수정, 초안 생성 또는 발행
5. Blogger가 반환한 게시글 URL을 `versions.json`에 반영
6. `outputs/tools.json` 재생성과 메인 카드 연결 확인
7. 비밀값과 의도하지 않은 파일이 없는지 검사
8. 관련 변경의 Git 커밋과 `main` 푸시
9. GitHub Actions와 GitHub Pages 배포 상태 확인
10. 공개 게시글과 도구 링크의 최종 동작 확인

“커밋은 항상 사용자가 한다”와 같은 고정 역할은 두지 않는다. 에이전트가 Git 쓰기와 원격 접근 권한을 사용할 수 있으면 직접 커밋·푸시한다. 실행 환경이 `.git` 쓰기나 네트워크를 차단할 때만 정확한 오류와 최소한의 사용자 실행 명령을 안내한다.

## 요청 표현에 따른 게시 상태

- `작성`, `준비`, `초안`: Blogger 초안으로 만들며 공개 발행하지 않는다.
- `게시`, `발행`, `공개`, `릴리스`, `완료해서 올려줘`: 검증 후 공개 발행까지 처리한다.
- 기존 게시글의 본문·제목 수정: 공개 글이 즉시 바뀌는 작업이므로 요청 범위를 확인하고 해당 글만 수정한다.
- 삭제, 휴지통 이동, 공개 글의 초안 전환: 파괴적이거나 공개 상태를 제거하는 작업이므로 사용자의 명시적 요청이 있을 때만 수행한다.

요청이 모호하면 콘텐츠와 파일은 준비하되 공개 발행은 초안으로 제한한다.

## Blogger API로 가능한 작업

OAuth 범위 `https://www.googleapis.com/auth/blogger`가 승인된 상태에서는 다음 작업을 수행할 수 있다.

- 블로그 및 게시글 목록 조회
- 게시글 단건 조회와 검색
- 새 게시글 추가
- 게시글 전체 수정 또는 부분 수정
- 초안 게시, 예약 발행, 공개 글의 초안 전환
- 게시글 삭제 또는 휴지통 이동
- 정적 페이지 조회·추가·수정·삭제
- 댓글 조회와 승인, 스팸 처리, 내용 제거, 삭제

공개 블로그의 공개 게시글 목록과 단건 조회는 인증 없이도 가능하지만, 초안·예약 글과 관리 작업에는 OAuth가 필요하다.

Blogger API v3의 공식 리소스에는 테마, 레이아웃, 위젯 관리 기능이 없다. 따라서 테마 XML 업로드와 레이아웃 변경은 Blogger 관리자 화면에서 별도로 처리한다. 로그인된 브라우저 자동화가 가능하고 사용자가 해당 변경을 요청한 경우에는 백업 후 관리자 화면 작업을 시도할 수 있지만, API 게시 자동화와 같은 범위로 간주하지 않는다.

## 인증 파일과 비밀값

로컬 인증 파일은 모두 `.secrets/blogger/` 아래에서만 관리한다.

- `credentials.json`: Google Cloud에서 받은 데스크톱 OAuth 클라이언트 정보
- `token.json`: 액세스 토큰, 갱신 토큰, 만료 정보
- `blog.json`: 기본 게시 대상 블로그 이름과 ID

이 폴더와 토큰·자격 증명 파일 패턴은 `.gitignore`로 제외한다. 토큰과 클라이언트 비밀값은 응답, 로그, Markdown, HTML, JSON 카탈로그, 커밋에 절대 포함하지 않는다. 액세스 토큰이 만료되면 갱신 토큰으로 재발급하고 새 토큰도 로컬 비밀 폴더에만 저장한다.

인증을 새로 해야 할 때만 다음 명령을 사용한다.

```text
node scripts/blogger-auth.mjs
```

## 게시글 원본과 발행 대상

- `toolbox/posts/<도구명>.html`: 계속 편집하는 최신 게시글 원본
- `outputs/<도구명>/<버전>/<HTML 파일>`: 해당 버전의 보존본이자 실제 Blogger 발행 기준
- `embed/<도구명>/index.html`: 게시글 iframe이 불러오는 최신 실행 기능
- `outputs/<도구명>/versions.json`: 도구 메타데이터, 최신 버전, Blogger 게시글 주소
- `outputs/tools.json`: 메인 화면이 읽는 최신 전체 카탈로그

Blogger에 게시할 본문은 `versions.json`의 `latestVersion` 항목이 가리키는 HTML을 사용한다. `toolbox/posts/`와 최신 버전 HTML의 내용이 다르면 먼저 원본과 버전 관계를 정리한 후 게시한다.

## 제목과 게시글 대조

새 도구 게시글의 권장 제목은 다음 형식이다.

```text
[초간단 툴박스] <도구 제목>
```

기존 게시글에는 접두사 뒤 공백이나 도구명 내부 띄어쓰기 차이가 있을 수 있다. `scripts/blogger-sync-post-urls.mjs`는 정확히 같은 제목을 우선하고, 일치하지 않으면 문자와 숫자만 남긴 제목이 도구 제목으로 끝나는지 비교한다. 후보가 두 개 이상이면 잘못 연결하지 않고 중단한다.

## 새 도구 발행 절차

1. `toolbox/tools/<도구명>.md`와 `toolbox/posts/<도구명>.html`을 준비한다.
2. 버전을 계산하고 `outputs/<도구명>/<버전>/`에 HTML과 `patch-notes.json`을 만든다.
3. `embed/<도구명>/index.html`을 갱신하고 iframe 높이 메시지, 입력 검증, 모바일 화면을 확인한다.
4. `versions.json`을 갱신하고 `node scripts/build-tool-catalog.mjs`를 실행한다.
5. 요청 상태에 따라 Blogger 초안 또는 공개 게시글을 생성한다.
6. API 응답의 게시글 ID, 상태, 공개 URL과 실제 공개 페이지를 확인한다.
7. `node scripts/blogger-sync-post-urls.mjs`로 `postUrl`과 전체 카탈로그를 다시 맞춘다.
8. JSON 구문, 버전 경로, 게시글 링크, iframe 기능을 검증한다.
9. 비밀값과 관련 없는 변경을 제외한 뒤 커밋하고 `main`에 푸시한다.
10. 카탈로그 자동화와 GitHub Pages 배포가 성공했는지 확인한다.

## 기존 도구 업데이트 절차

- 실행 기능만 바뀌고 게시글 설명이 그대로라면 `embed/<도구명>/index.html`과 버전 기록을 갱신한다. 고정 iframe 주소를 사용하므로 Blogger 본문을 다시 수정하지 않아도 된다.
- 제목, 설명, 사용 방법, FAQ, iframe 외부 구조가 바뀌면 새 버전 HTML을 만든 후 기존 Blogger 게시글을 수정한다.
- 기존 게시글은 새 글을 중복 생성하지 않고 현재 URL의 글을 업데이트한다.
- 수정 후 `postUrl`, 최신 버전, 카탈로그, 공개 페이지를 다시 확인한다.

## 운영 명령

전체 도구 최신 카탈로그 생성:

```text
node scripts/build-tool-catalog.mjs
```

게시 중인 Blogger 글과 도구 제목을 대조해 게시글 URL 및 카탈로그 갱신:

```text
node scripts/blogger-sync-post-urls.mjs
```

`versions.json`이 `main`에 푸시되면 `.github/workflows/update-tool-catalog.yml`도 최신 카탈로그를 검사하고 필요한 경우 자동 커밋한다.

## 실패 처리

- OAuth 승인이 취소되거나 갱신 토큰이 없으면 인증을 다시 진행한다.
- 동일한 제목 후보가 여러 개면 자동 연결하지 않고 대상 게시글을 식별한다.
- API 또는 네트워크가 막히면 로그인된 Blogger 관리 화면의 공개 상태와 URL을 읽기 전용으로 대조할 수 있다.
- 게시, 수정, Git 푸시 같은 외부 변경이 환경 권한 때문에 불가능하면 완료했다고 보고하지 않고 차단 원인과 남은 작업을 명확히 알린다.
- 관련 없는 사용자 변경이 섞인 작업 트리에서는 해당 변경을 보존하고, 안전하게 분리할 수 있는 파일만 커밋한다.

## 최종 검증 목록

- 구현 완료 후 실제 게시글과 iframe 도구를 데스크톱·모바일 크기로 직접 확인했는지 점검
- 게시글과 iframe에 가로 넘침, 비정상적인 폭 축소, 콘텐츠 잘림, 내부 중복 스크롤이 없는지 확인
- 제목·설명·기능 카드·입력·결과·표·FAQ의 간격과 글자 크기, 버튼 줄바꿈과 터치 영역이 자연스러운지 확인
- 정상 입력, 오류 입력, 빈 상태, 긴 텍스트, 넓은 표처럼 레이아웃이 달라지는 상태를 확인
- 디자인 문제가 발견되면 수정 후 같은 화면 크기와 상태에서 다시 검증하고 `patch-notes.json`에 결과를 기록
- 게시글 상태가 요청과 같은 `DRAFT`, `LIVE`, `SCHEDULED` 중 하나인지 확인
- API가 반환한 제목, 게시글 ID, URL이 대상 도구와 일치하는지 확인
- 공개 글은 로그아웃 상태에서도 제목과 본문이 열리는지 확인
- iframe 주소가 `https://leedohon.github.io/toolbox-project/embed/<도구명>/` 형식인지 확인
- `versions.json`의 `postUrl`과 `outputs/tools.json`의 `postUrl`이 같은지 확인
- `outputs/tools.json`의 버전과 `latestVersion`이 같은지 확인
- 자격 증명과 토큰이 Git 추적 대상이 아닌지 확인
- 커밋 해시, 작업 트리, `origin/main`, GitHub Actions, GitHub Pages 배포 상태 확인

## 공식 참고 문서

- Blogger API v3 전체 참고: `https://developers.google.com/blogger/docs/3.0/reference`
- 게시글 리소스와 지원 작업: `https://developers.google.com/blogger/docs/3.0/reference/posts`
- 게시글 추가: `https://developers.google.com/blogger/docs/3.0/reference/posts/insert`
- 초안 게시 및 예약 발행: `https://developers.google.com/blogger/docs/3.0/reference/posts/publish`
- 정적 페이지: `https://developers.google.com/blogger/docs/3.0/reference/pages`
- 댓글 관리: `https://developers.google.com/blogger/docs/3.0/reference/comments`
