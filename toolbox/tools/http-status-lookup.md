---
title: 개발자 빠른 참조·검사 도구
slug: http-status-lookup
type: converter
description: HTTP·MIME·Cron·chmod 정보를 찾고 ISBN 체크 숫자를 한곳에서 검사합니다.
status: published
modules: [http-status-lookup, chmod-calculator, cron-expression-explainer, mime-type-lookup, isbn-validator]
inputs:
  - id: mode
    label: 찾는 방식
    type: radio
  - id: code
    label: HTTP 상태 코드
    type: number
  - id: query
    label: 상태 이름·의미
    type: text
---

## 기능
- Ctrl/⌘+Enter 상태 조회와 화면 단축키 안내

- 2xx·3xx·4xx·5xx
- 영문 상태 이름
- 한글 의미
- 응답 분류
- 상태 코드별 일반적인 후속 행동과 재시도 판단 안내
- 200·404·429·500 대표 상태 코드 빠른 조회
- 본문 없는 성공 응답을 확인하는 204 빠른 조회
- 코드 번호를 몰라도 영문 이름·한글 의미로 검색
- 조회한 상태와 후속 조치를 마크다운 응답 점검표로 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/http-status-lookup/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- `server`, `인증`, `redirect` 같은 단어로 지원 상태 코드를 한 번에 찾는다.
