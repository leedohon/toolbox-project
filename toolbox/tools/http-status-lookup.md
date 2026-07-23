---
title: 개발자 빠른 참조·검사 도구
slug: http-status-lookup
type: converter
description: HTTP·MIME·Cron·chmod 정보를 찾고 ISBN 체크 숫자를 한곳에서 검사합니다.
status: published
modules: [http-status-lookup, chmod-calculator, cron-expression-explainer, mime-type-lookup, isbn-validator]
inputs:
  - id: code
    label: HTTP 상태 코드
    type: number
---

## 기능

- 2xx·3xx·4xx·5xx
- 영문 상태 이름
- 한글 의미
- 응답 분류

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/http-status-lookup/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
