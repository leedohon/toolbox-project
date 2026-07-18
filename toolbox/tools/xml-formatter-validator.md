---
title: XML 검사·정리 도구
slug: xml-formatter-validator
type: converter
description: XML 문법 오류를 확인하고 들여쓰기 정리·한 줄 압축 결과를 브라우저에서 만듭니다.
status: published
inputs:
  - id: xml
    label: XML 입력
    type: textarea
  - id: mode
    label: 결과 방식
    type: radio
---

## 기능

- XML 문법 오류 안내
- 2칸·4칸 들여쓰기
- 한 줄 압축
- 결과 복사·파일 저장

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/xml-formatter-validator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
