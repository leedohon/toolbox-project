---
title: 화면 비율 계산기
slug: aspect-ratio-calculator
type: calculator
description: 가로·세로 크기의 비율을 줄여 표시하고 한쪽 길이에 맞는 반대쪽 길이를 계산합니다.
status: published
inputs:
  - id: width
    label: 원본 가로
    type: number
  - id: height
    label: 원본 세로
    type: number
  - id: target
    label: 목표 크기
    type: number
---

## 기능

- 최대공약수 기반 비율 계산
- 가로 또는 세로 기준 크기 계산
- 소수·음수 없는 입력 검증
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/aspect-ratio-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
