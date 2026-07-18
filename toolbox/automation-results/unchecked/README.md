# 미확인 완료 기록 요약

마지막 정리: 2026-07-19 02:42 KST

이 문서는 `unchecked/`에 남아 있는 완료 기록을 빠르게 확인하기 위한 요약이다. 실행의 단일 원본은 같은 폴더의 JSON 파일이며, 이 문서를 만들거나 읽는 것만으로는 확인 완료로 처리하지 않는다.

## 한눈에 보기

| 실행 ID | 워크플로 | 완료 시각 | 주요 결과 | Blogger | Git·배포 | 확인 |
|---|---|---:|---|---|---|---|
| `20260718-184255-hard` | 하드 | 2026-07-18 19:10 KST | 기존 도구 개선 6건, 페이지 작업 3건, 공통 결함 수정 2건 이상 | 신규 2개·기존 17개 반영 완료 | 푸시·Pages·카탈로그 성공 | 미확인 |
| `20260718-192400-create` | 크리에이트 1차 | 2026-07-18 19:48 KST | 신규 도구 5개 공개 | 신규 5개 발행 완료 | 푸시·Pages 성공 | 미확인 |
| `20260718-193400-create` | 크리에이트 2차 | 2026-07-18 19:48 KST | 신규 도구 5개 공개 | 신규 5개 발행 완료 | 푸시·Pages 성공 | 미확인 |

세 실행 모두 `status: completed`, `confirm: N`이며 차단 사항은 없다.

## 1. 하드 워크플로

- 실행 ID: `20260718-184255-hard`
- 원본: [20260718-184255-hard.json](./20260718-184255-hard.json)
- Git 커밋: `b96089d7ac82e94bf950d703c9a863ea7e32a2c1`
- 배포: GitHub Pages `29640206526`, 카탈로그 `29640206736` 성공

### 기존 도구 개선 6건

- QR·바코드 생성기 `0.5.4v`: 전경색과 배경색이 같은 읽을 수 없는 결과의 생성·저장 차단
- JSON 도구 `0.7.0v`: 5MB 이하 파일 선택과 드래그 앤 드롭 입력
- 텍스트 인코더·디코더 `0.9.2v`: Base64 파일 10MB 제한과 가까운 오류 안내
- 이미지 모자이크 도구 `0.2.4v`: 파일 드롭 영역 Enter·Space 키보드 실행
- 다용도 계산기 `1.0.4v`: 동적 결과·오류·복사 상태 KOR / ENG 적용
- 다용도 뽑기게임 `0.1.0v`: 컨테이너 언어 선택과 내부 모듈 전달

### 페이지 작업 3건

- [정규식 테스트 도구](https://bloggiedh.blogspot.com/2026/07/blog-post_18.html) 신규 공개
- [화면 비율 계산기](https://bloggiedh.blogspot.com/2026/07/blog-post_78.html) 신규 공개
- URL 인코더·디코더를 텍스트 인코더·디코더로 통합하고 기존 주소 호환 안내 유지

### 공통 수정

- select 공통 포커스 표시와 비활성 컨트롤 상태 개선
- 은퇴 게시글에 다른 도구의 게임 문구가 섞이는 문제 수정
- 모바일 375px·데스크톱 1280px, KOR / ENG, iframe 높이와 공개 콘솔 오류 검증 완료

## 2. 크리에이트 1차

- 실행 ID: `20260718-192400-create`
- 원본: [20260718-192400-create.json](./20260718-192400-create.json)
- 최종 릴리스 커밋: `ce986d4f93a984b1d439872656254e7a4a5751d3`

### 신규 도구 5개

- [텍스트·파일 해시 생성기](https://bloggiedh.blogspot.com/2026/07/blog-post_950.html)
- [2진수·16진수 진법 변환기](https://bloggiedh.blogspot.com/2026/07/216.html)
- [안전한 파일명 정리기](https://bloggiedh.blogspot.com/2026/07/blog-post_493.html)
- [Lorem Ipsum 문장 생성기](https://bloggiedh.blogspot.com/2026/07/lorem-ipsum.html)
- [CSS clamp 반응형 계산기](https://bloggiedh.blogspot.com/2026/07/css-clamp.html)

### 검증

- 릴리스·JSON·모듈·ES 모듈 검증 통과
- 정상·오류 입력과 KOR / ENG 동적 상태 확인
- 공개 iframe·Blogger 1280px·375px 가로 넘침 없음
- 모바일 자동 포커스와 공개 콘솔 오류 없음

## 3. 크리에이트 2차

- 실행 ID: `20260718-193400-create`
- 원본: [20260718-193400-create.json](./20260718-193400-create.json)
- 최종 릴리스 커밋: `ce986d4f93a984b1d439872656254e7a4a5751d3`

### 신규 도구 5개

- [유니코드 문자 분석기](https://bloggiedh.blogspot.com/2026/07/blog-post_273.html)
- [JWT 내용 확인기](https://bloggiedh.blogspot.com/2026/07/jwt.html)
- [데이터 용량 단위 변환기](https://bloggiedh.blogspot.com/2026/07/blog-post_112.html)
- [DPI·PPI 해상도 계산기](https://bloggiedh.blogspot.com/2026/07/dpippi.html)
- [CSS 그림자 생성기](https://bloggiedh.blogspot.com/2026/07/css_0600697105.html)

### 검증

- 릴리스·JSON·모듈·ES 모듈 검증 통과
- 모바일 표 내부 스크롤과 공통 자산 캐시 갱신 확인
- 정상·오류 입력, KOR / ENG, 숨김 상태와 iframe 높이 확인
- 공개 iframe·Blogger 1280px·375px 가로 넘침과 콘솔 오류 없음

## 확인 처리 기준

- 사용자가 실행 결과를 확인했다고 명시하기 전까지 JSON의 `confirm`은 `N`으로 유지한다.
- 확인 완료 시 JSON의 확인 시각과 확인 단계를 갱신한 뒤 파일을 `checked/`로 이동한다.
- 일부 실행만 확인했다면 해당 실행 ID만 이동한다.
