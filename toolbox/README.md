# Toolbox

`blogger` 프로젝트의 첫 하위 프로젝트입니다. Blogger 게시글 안에서 iframe으로 바로 실행되는 가벼운 도구를 만듭니다.

- 새 도구 기본 기준: [Blogger iframe 도구 기본 템플릿](templates/blogger-inline-tool-template.md)
- 현재 구현 도구: QR · 바코드 생성기, JSON 도구, Base64 도구
- Blogger 테마: [오픈월드 툴박스 테마](theme/README.md)
- 프로젝트 규칙: [AGENTS.md](AGENTS.md)

메인 소개와 도구 목록은 저장소의 `outputs/site.json`, `outputs/tools.json`을 페이지 로드마다 읽습니다. 도구 버전 정보가 `main`에 푸시되면 카탈로그가 자동 재생성됩니다.
