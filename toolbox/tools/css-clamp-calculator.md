---
title: CSS clamp 반응형 계산기
slug: css-clamp-calculator
type: calculator
description: 최소·최대 크기와 뷰포트 범위를 입력해 반응형 CSS clamp 식을 계산합니다.
status: retired
replacementTool: color-converter-contrast
inputs:
  - id: sizes
    label: 최소·최대 크기
    type: number
  - id: viewports
    label: 최소·최대 뷰포트
    type: number
---

## 기능

- px 기준 네 값 입력
- 선형 vw 식 계산
- 실시간 글자 미리보기
- CSS 코드 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/css-clamp-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
