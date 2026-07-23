---
title: 로마 숫자 변환기
slug: roman-numeral-converter
type: converter
description: 1~3999의 아라비아 숫자와 표준 로마 숫자 표기를 서로 변환합니다.
status: retired
replacementTool: base64-tools
inputs:
  - id: mode
    label: 변환 방향
    type: select
  - id: value
    label: 변환할 값
    type: text
---

## 기능

- 양방향 변환
- 1~3999 범위
- 표준 표기 검증
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/roman-numeral-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
