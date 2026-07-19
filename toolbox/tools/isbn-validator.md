---
title: ISBN-10·ISBN-13 검사기
slug: isbn-validator
type: converter
description: 하이픈이 포함된 ISBN-10·ISBN-13을 정리하고 체크 숫자가 올바른지 검사합니다.
status: published
inputs:
  - id: isbn
    label: ISBN
    type: text
---

## 기능

- ISBN-10·ISBN-13
- 하이픈·공백 정리
- 체크 숫자 검증
- 형식 표시

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/isbn-validator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
