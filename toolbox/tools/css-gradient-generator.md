---
title: CSS 그라데이션 생성기
slug: css-gradient-generator
type: template-generator
description: 색상과 방향을 조절해 선형·원형 그라데이션을 미리 보고 CSS 코드를 만듭니다.
status: published
inputs:
  - id: type
    label: 그라데이션 유형
    type: radio
  - id: stops
    label: 색상 지점
    type: list
---

## 기능

- 선형·원형 그라데이션
- 2~5개 색상 지점 추가·삭제
- 각도와 색상 위치 조절
- 실시간 미리보기와 CSS 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/css-gradient-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
