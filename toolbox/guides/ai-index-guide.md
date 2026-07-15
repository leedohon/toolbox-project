# AI 빠른 색인 가이드

## 목적

AI 작업자가 전체 저장소를 반복 탐색하지 않고 변경 대상, 단일 원본, 공개 상태와 대체 관계를 빠르게 찾게 한다.

## 색인 계층

1. 루트 `ai-index.json`: 프로젝트 범위, 주요 지침과 toolbox 색인 위치
2. `toolbox/ai-index.json`: 전체 도구의 상태와 핵심 파일 경로
3. `embed/<tool>/ai-index.json`: 신규·수정 도구의 기능 진입점, 모듈과 호환 정보

기존 모든 도구에 세 번째 색인을 소급 생성하지 않는다. 새로 만들거나 기능·구조를 수정하는 도구부터 `node scripts/build-ai-index.mjs <tool>`로 추가한다.

## 필드 원칙

- 경로는 저장소 루트 기준 상대 경로로 기록한다.
- 표시명보다 바뀌지 않는 `tool`과 `index`를 우선 식별자로 사용한다.
- `status`, `replacementTool`, `category`, `latestVersion`을 포함해 검색 결과만 보고도 현재 사용 여부를 판단하게 한다.
- 기능을 추측해 서술하지 않고 manifest와 모듈 등록 JSON에서 읽은 값만 기록한다.
- 비밀값, OAuth 경로와 개인 환경 절대 경로는 기록하지 않는다.

## 작업 순서

1. 작업을 시작하면 루트 `ai-index.json`과 `toolbox/ai-index.json`을 먼저 읽는다.
2. 대상 도구의 `embed/<tool>/ai-index.json`이 있으면 다음으로 읽는다.
3. 색인이 가리키는 최신 정의·manifest·모듈 등록만 열고, 과거 릴리스는 회귀 조사 때만 읽는다.
4. 신규·수정·통합 작업을 마치면 색인 생성 스크립트를 실행하고 JSON 검증을 함께 수행한다.

