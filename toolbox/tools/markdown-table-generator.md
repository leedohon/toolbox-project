---
title: 마크다운 표 생성기
slug: markdown-table-generator
type: template-generator
description: 쉼표로 구분한 머리글과 행 데이터를 마크다운 표 문법으로 바꿉니다.
status: published
inputs:
  - id: headers
    label: 머리글
    type: text
  - id: rows
    label: 행 데이터
    type: textarea
---

## 기능

- 쉼표 구분 머리글
- 여러 데이터 행
- 열 수 자동 맞춤
- 표 문법 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/markdown-table-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
