---
title: CSS 그림자 생성기
slug: css-box-shadow-generator
type: template-generator
description: 위치·흐림·확산·색상을 조절해 box-shadow 미리보기와 CSS 코드를 만듭니다.
status: retired
replacementTool: color-converter-contrast
inputs:
  - id: geometry
    label: 그림자 위치와 크기
    type: range
  - id: color
    label: 색상과 투명도
    type: color
---

## 기능

- 가로·세로·흐림·확산 슬라이더
- 색상·투명도 선택
- inset 안쪽 그림자
- 실시간 미리보기·복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/css-box-shadow-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
