---
title: 평균·중앙값 계산기
slug: average-median-calculator
type: calculator
description: 쉼표나 줄바꿈으로 입력한 숫자의 평균·중앙값·합계·범위를 한 번에 계산합니다.
status: retired
replacementTool: date-calculator
inputs:
  - id: numbers
    label: 숫자 목록
    type: textarea
---

## 기능

- 평균·중앙값
- 합계·개수
- 최솟값·최댓값
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/average-median-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
