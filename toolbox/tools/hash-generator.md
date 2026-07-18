---
title: 텍스트·파일 해시 생성기
slug: hash-generator
type: converter
description: 텍스트나 파일을 선택해 SHA-256·SHA-384·SHA-512 해시값을 브라우저에서 계산합니다.
status: published
inputs:
  - id: source
    label: 텍스트 또는 파일
    type: text-file
  - id: algorithm
    label: 해시 알고리즘
    type: radio
---

## 기능

- 텍스트와 파일 입력
- SHA-256·SHA-384·SHA-512
- 대문자·소문자 출력
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/hash-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
