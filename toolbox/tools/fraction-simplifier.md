---
title: 분수 약분 계산기
slug: fraction-simplifier
type: calculator
description: 분자와 분모의 최대공약수를 구해 분수를 가장 간단한 기약분수로 약분합니다.
status: retired
inputs:
  - id: numerator
    label: 분자
    type: number
  - id: denominator
    label: 분모
    type: number
---

## 기능

- 정수 분자·분모
- 최대공약수
- 음수 부호 정리
- 소수값 함께 표시

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 `date-calculator`의 일반 계산으로 통합한다.

- 기능은 고정 주소 `embed/fraction-simplifier/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
