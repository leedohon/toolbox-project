---
title: 비율 간단히 계산기
slug: ratio-simplifier
type: calculator
description: 두 정수의 최대공약수를 구해 가장 간단한 정수 비율로 정리합니다.
status: retired
inputs:
  - id: left
    label: 첫 번째 값
    type: number
  - id: right
    label: 두 번째 값
    type: number
---

## 기능

- 정수 비율 약분
- 최대공약수
- 0 포함 비율
- 나눗셈 값

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 `date-calculator`의 일반 계산으로 통합한다.

- 기능은 고정 주소 `embed/ratio-simplifier/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
