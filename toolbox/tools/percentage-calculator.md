---
title: 백분율 계산기
slug: percentage-calculator
type: calculator
description: 두 숫자를 입력해 비율값, 전체에서 차지하는 퍼센트, 증가·감소율을 계산합니다.
status: retired
replacementTool: date-calculator
inputs:
  - id: mode
    label: 계산 방식
    type: radio
  - id: values
    label: 계산할 두 숫자
    type: number
---

## 기능

- 전체의 일정 퍼센트 계산
- 전체에서 차지하는 비율 계산
- 증가·감소율 계산
- 계산식과 결과 복사

## 실행 규칙

- 입력은 유한한 숫자만 허용하고 0으로 나눌 수 없는 모드에서는 가까운 위치에 오류를 표시한다.
- 결과는 불필요한 소수점 0을 제거하되 매우 크거나 작은 값도 읽을 수 있게 표시한다.
- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/percentage-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
