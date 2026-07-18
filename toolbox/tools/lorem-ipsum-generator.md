---
title: Lorem Ipsum 문장 생성기
slug: lorem-ipsum-generator
type: template-generator
description: 레이아웃 테스트에 쓸 Lorem Ipsum 문단을 원하는 개수와 길이로 생성합니다.
status: published
inputs:
  - id: paragraphs
    label: 문단 수
    type: range
  - id: length
    label: 문단 길이
    type: radio
---

## 기능

- 1~10개 문단
- 짧게·보통·길게
- 첫 문장 고정 선택
- 전체 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/lorem-ipsum-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
