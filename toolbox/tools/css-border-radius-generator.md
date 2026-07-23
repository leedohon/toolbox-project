---
title: CSS 모서리 둥글기 생성기
slug: css-border-radius-generator
type: template-generator
description: 네 모서리의 px 값을 입력해 border-radius CSS 코드를 만듭니다.
status: retired
replacementTool: color-converter-contrast
inputs:
  - id: corners
    label: 네 모서리 값
    type: number
---

## 기능

- 네 모서리 개별 입력
- 0~999px 검증
- 표준 순서 안내
- CSS 코드 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/css-border-radius-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
