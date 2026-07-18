---
title: URL 분석·쿼리 편집기
slug: url-parser-builder
type: converter
description: URL의 주소 구성요소와 쿼리 항목을 나누어 확인하고 수정한 주소를 다시 만듭니다.
status: published
inputs:
  - id: url
    label: 분석할 URL
    type: textarea
  - id: query
    label: 쿼리 항목
    type: repeated-row
---

## 기능

- 프로토콜·호스트·경로 분석
- 쿼리 항목별 편집
- 중복 쿼리 키 보존
- 완성 URL 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/url-parser-builder/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
