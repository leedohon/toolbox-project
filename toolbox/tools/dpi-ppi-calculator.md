---
title: DPI·PPI 해상도 계산기
slug: dpi-ppi-calculator
type: calculator
description: 이미지 픽셀과 실제 출력 크기를 입력해 가로·세로 DPI와 PPI를 계산합니다.
status: retired
replacementTool: image-resizer-compressor
inputs:
  - id: pixels
    label: 가로·세로 픽셀
    type: number
  - id: size
    label: 실제 크기
    type: number
---

## 기능

- px와 inch·cm 입력
- 가로·세로 밀도
- 평균 밀도와 출력 크기
- 인쇄 기준 안내

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/dpi-ppi-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
