# 오픈월드 Blogger 테마

## 업로드 파일

- `openworld-toolbox-upload.xml`: 실제 Blogger 백업 골조를 유지한 최종 업로드 파일
- `backups/theme-2198164223054760451.xml`: 수정 전 원본 백업
- `openworld-toolbox-compatible.xml`, `openworld-toolbox.xml`: 이전 실험안 보관본

`openworld-toolbox-upload.xml`은 콘텐츠나 디자인을 품지 않습니다. 홈과 게시글의 표시 위치 및 외부 로더를 가리키는 `openworld.loader.url` 테마 변수만 추가합니다.

## 저장소에서 관리하는 전역 요소

- `assets/blogger/theme.css`: 메인·게시글 디자인과 Pretendard 글꼴
- `assets/blogger/site.js`: 소개, 검색, 목록, 게시글 돌아가기 동작
- `outputs/site.json`: 소개글과 공통 화면 문구
- `outputs/tools.json`: 최신 도구 목록과 Blogger 게시글 주소

따라서 XML을 한 번 업로드한 뒤에는 위 파일을 GitHub Pages에 배포하는 것만으로 전역 화면이 갱신됩니다.
브라우저는 JSON을 캐시 없이 다시 읽으며, `versions.json` 변경이 `main`에 푸시되면 GitHub Actions가 최신 `outputs/tools.json`을 자동 커밋합니다.

도구 게시글은 `theme.css`의 `.tb-post` 공통 테마를 사용합니다. 게시글 HTML에는 공통 CSS를 복제하지 않고 `tb-hero`, `tb-features`, `tb-frame`, `tb-steps` 같은 구조 클래스만 넣습니다. 새 게시글이나 수정 작업은 [`blogger-inline-tool-template.md`](../templates/blogger-inline-tool-template.md)를 기준으로 작성합니다.

## 도구 목록 갱신

```text
node scripts/build-tool-catalog.mjs
```

각 도구의 `versions.json`을 읽어 `outputs/tools.json`을 다시 만듭니다.

Blogger 글을 발행한 뒤에는 아래 명령으로 글 제목과 도구 제목을 대조해 `postUrl`을 채우고 목록을 다시 만듭니다.

```text
node scripts/blogger-sync-post-urls.mjs
```

제목이 같은 게시글이 두 개 이상이면 잘못 연결하지 않고 오류로 중단합니다.

## Blogger 적용

1. 현재 테마를 한 번 더 백업합니다.
2. Blogger의 **테마 → 맞춤설정 옆 메뉴 → 복원**에서 `openworld-toolbox-upload.xml`을 업로드합니다.
3. 홈에서 소개, 검색, 카드, 기존 게시글 목록을 확인합니다.
4. 게시글에서 본문 카드와 **도구 검색으로 돌아가기** 링크를 확인합니다.

## Blogger API와의 경계

Blogger API v3는 게시글, 정적 페이지, 댓글을 관리하지만 테마 XML, 레이아웃, 위젯을 관리하는 리소스는 제공하지 않습니다. 따라서 게시글 작성·수정·발행은 자동화할 수 있지만 이 XML의 최초 업로드와 레이아웃 변경은 Blogger 관리자 화면 작업으로 분리합니다.

게시글부터 Git·Pages 배포까지의 전체 운영 기준은 [Blogger 게시 운영 및 자동화 기준](../BLOGGER-OPERATIONS.md)을 따릅니다.
