---
title: JWT 내용 확인기
slug: jwt-decoder
type: converter
description: JWT의 헤더와 페이로드를 서명 검증 없이 브라우저에서 읽기 좋게 확인합니다.
status: published
inputs:
  - id: token
    label: JWT 문자열
    type: textarea
---

## 기능

- Base64URL 디코딩
- 헤더·페이로드 JSON
- exp·iat 시간 안내
- 서명 미검증 경고

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/jwt-decoder/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
