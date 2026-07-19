---
title: CSS px·rem·em 변환기
slug: css-unit-converter
type: converter
description: 기준 글자 크기를 사용해 CSS px·rem·em 값을 서로 변환합니다.
status: published
inputs:
  - id: value
    label: 변환할 값
    type: number
  - id: from
    label: 원본 단위
    type: select
  - id: to
    label: 결과 단위
    type: select
  - id: base
    label: 기준 글자 크기
    type: number
---

## 기능

- px·rem·em 변환
- 기준 글자 크기 설정
- 소수값 지원
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/css-unit-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
