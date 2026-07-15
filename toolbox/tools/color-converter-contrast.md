---
title: 색상 변환·대비 검사기
slug: color-converter-contrast
type: converter
description: 두 색상을 HEX·RGB·HSL로 변환하고 글자와 배경의 접근성 대비를 확인합니다.
status: published
inputs:
  - id: foreground
    label: 글자색
    type: color
  - id: background
    label: 배경색
    type: color
---

## 기능

- HEX·RGB·HSL 동시 변환
- 글자색과 배경색 실시간 미리보기
- WCAG AA·AAA 대비 판정
- 색상 교환과 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/color-converter-contrast/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
