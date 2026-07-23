---
title: HTML 엔티티 변환기
slug: html-entity-converter
type: converter
description: HTML 특수문자를 안전한 엔티티로 바꾸거나 엔티티 표기를 원문으로 되돌립니다.
status: retired
replacementTool: base64-tools
inputs:
  - id: mode
    label: 변환 방식
    type: select
  - id: text
    label: 변환할 텍스트
    type: textarea
---

## 기능

- 인코딩·디코딩
- 꺾쇠·따옴표·앰퍼샌드
- 장문 입력
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/html-entity-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
