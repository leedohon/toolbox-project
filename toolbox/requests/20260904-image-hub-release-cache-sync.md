# 이미지 도구 공개 캐시 버전 동기화

- 사용자 요청: 예약 하드 워크플로에서 실제 변경을 매번 Blogger 게시글과 GitHub Pages에 반영하고 공개 화면에서 확인한다.
- 확인된 결함: Blogger 공개 글의 최신 패치노트는 `1.11.1v`이지만 내부 이미지 엔진 주소는 `release=1.11.0v`를 유지한다.
- 원인: 이미지 도구 릴리스 뒤 `embed/image-resizer-compressor/modules.json`의 허브 모듈 캐시 키 동기화가 누락됐다.
- 수정: minimum `1.11.2v`를 생성하고 허브 모듈의 `release` 값을 최신 버전과 일치시킨다.
- 검증: Blogger 공개 패치노트 `1.11.2v`, 내부 iframe `release=1.11.2v`, Git main 푸시, Pages 배포 성공과 공개 Alt+S 동작을 확인한다.
- 안전: 기존 게시글을 갱신하며 중복 생성, 삭제, 휴지통 이동과 초안 전환은 하지 않는다.
