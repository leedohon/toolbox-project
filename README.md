# blogger

블로그 콘텐츠와 독립 실행형 도구를 함께 제공하는 상위 프로젝트입니다.

## 하위 프로젝트

- `toolbox`: 생성기, 컨버터, 계산기 도구 모음. Blogger용 게시글 HTML과 GitHub Pages에서 자동 갱신되는 iframe 기능을 분리해 제공합니다.

## 배포 구조

- `toolbox/posts/`: 게시글 원본
- `outputs/<도구>/<버전>/`: Blogger에 복사할 버전별 게시글 HTML
- `embed/<도구>/index.html`: 게시글의 고정 iframe 주소에서 실행되는 최신 기능

GitHub Pages의 배포 원본을 `main` 브랜치의 루트로 설정하면 `embed/`의 변경 사항이 푸시 후 게시글에 자동 반영됩니다.

프로젝트의 지속적인 운영 원칙과 결정 사항은 [AGENTS.md](AGENTS.md)에 기록합니다.
