---
title: 파일 확장자 MIME 타입 찾기
slug: mime-type-lookup
type: converter
description: 파일 확장자를 입력해 대표 MIME 타입과 Content-Type 헤더 예시를 확인합니다.
status: retired
replacementTool: http-status-lookup
inputs:
  - id: extension
    label: 파일 확장자
    type: text
---

## 기능

- 대표 웹·문서·이미지 확장자
- MIME 타입
- Content-Type 예시
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/mime-type-lookup/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
