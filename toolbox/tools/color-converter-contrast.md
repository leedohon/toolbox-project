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
- 밝은 스카이블루 배경과 진한 글자색의 접근성 예제를 즉시 적용
- 검정 글자와 흰 배경의 AAA 대비 예제를 즉시 적용

- HEX·RGB·HSL 동시 변환
- 글자색과 배경색 실시간 미리보기
- WCAG AA·AAA 대비 판정
- 색상 교환과 결과 복사
- 선택 색상을 바로 적용할 수 있는 CSS 변수·color·background 묶음
- 3자리·6자리 HEX 입력과 UI 구성요소 3:1 판정
- 현재 배경에서 검정·흰색 중 대비가 더 높은 글자색 추천과 즉시 적용
- Ctrl/⌘+Enter 변환값 복사와 현재 입력 초기화

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 3자리 HEX는 6자리로 확장하고 완성되지 않은 입력에는 즉시 오류를 띄우지 않는다.
- 자동 복사가 차단되어 대체 결과를 표시해도 모바일 입력을 강제로 선택하거나 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/color-converter-contrast/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 접근성 기준을 만족하는 밝은 글자·어두운 화면 조합을 적용한다.
