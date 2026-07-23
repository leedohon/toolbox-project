---
title: 2진수·16진수 진법 변환기
slug: number-base-converter
type: converter
description: 2진수·8진수·10진수·16진수를 정수 정밀도 손실 없이 서로 변환합니다.
status: retired
replacementTool: base64-tools
inputs:
  - id: value
    label: 변환할 정수
    type: text
  - id: base
    label: 입력 진법
    type: radio
---

## 기능

- 2·8·10·16진수 입력
- BigInt 정밀 변환
- 네 진법 동시 결과
- 접두어 표시 선택

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/number-base-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
