---
title: CSS 디자인 도구
slug: color-converter-contrast
type: converter
description: 색상·대비·그라데이션·clamp·그림자·단위·모서리 CSS를 한곳에서 만들고 확인합니다.
status: published
modules: [color-converter-contrast, css-gradient-generator, css-clamp-calculator, css-box-shadow-generator, css-unit-converter, css-border-radius-generator]
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
- 3자리·6자리 HEX 입력과 UI 구성요소 3:1 판정

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 3자리 HEX는 6자리로 확장하고 완성되지 않은 입력에는 즉시 오류를 띄우지 않는다.

## 호환성

- 기능은 고정 주소 `embed/color-converter-contrast/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
