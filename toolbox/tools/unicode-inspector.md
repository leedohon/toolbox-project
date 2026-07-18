---
title: 유니코드 문자 분석기
slug: unicode-inspector
type: converter
description: 텍스트의 각 문자를 유니코드 코드 포인트와 UTF-16·HTML 표기로 나누어 확인합니다.
status: published
inputs:
  - id: text
    label: 분석할 텍스트
    type: textarea
---

## 기능

- 문자별 코드 포인트
- U+·UTF-16·HTML 표기
- 공백 문자 이름
- TSV 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/unicode-inspector/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
