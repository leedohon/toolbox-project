# blogger

블로그 콘텐츠와 독립 실행형 도구를 함께 제공하는 상위 프로젝트입니다.

## 하위 프로젝트

- `toolbox`: 생성기, 컨버터, 계산기 도구 모음. Blogger용 게시글 HTML과 GitHub Pages에서 자동 갱신되는 iframe 기능을 분리해 제공합니다.

## 배포 구조

- `toolbox/posts/`: 게시글 원본
- `outputs/<도구>/<버전>/`: Blogger에 복사할 버전별 게시글 HTML
- `outputs/tools.json`: 검색·목록 화면에서 사용할 전체 도구 최신 카탈로그
- `outputs/site.json`: Blogger 메인 소개와 공통 화면 문구
- `embed/<도구>/index.html`: 게시글의 고정 iframe 주소에서 실행되는 최신 기능
- `assets/blogger/`: Blogger 메인·게시글 전역 디자인과 목록 로더
- `toolbox/theme/openworld-toolbox-upload.xml`: Blogger 백업 골조를 보존한 업로드용 테마

GitHub Pages의 배포 원본을 `main` 브랜치의 루트로 설정하면 `embed/`의 변경 사항이 푸시 후 게시글에 자동 반영됩니다.

도구 버전 정보를 바꾼 뒤 `node scripts/build-tool-catalog.mjs`를 실행하면 메인 목록이 갱신됩니다. Blogger 게시글을 발행한 뒤 `node scripts/blogger-sync-post-urls.mjs`를 실행하면 각 카드가 해당 게시글 주소로 연결됩니다. 업로드용 XML에는 콘텐츠와 디자인을 하드코딩하지 않으므로 이후 메인·게시글 테마는 저장소의 CSS·JS·JSON 배포만으로 바뀝니다.

`versions.json` 변경을 `main`에 푸시하면 GitHub Actions도 최신 카탈로그를 자동 생성하고 커밋합니다. 메인 화면은 JSON을 캐시 없이 읽으므로 GitHub Pages 배포가 끝나는 즉시 최신 목록을 사용합니다.

프로젝트의 지속적인 운영 원칙과 결정 사항은 [AGENTS.md](AGENTS.md)에 기록합니다.
