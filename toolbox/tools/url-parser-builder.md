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
- 주소 구성요소와 쿼리 이름·값 입력은 공통 한 줄 입력 스타일을 사용하며, 읽기 전용 값과 편집 가능한 값을 시각적으로 구분한다.
- 모바일 쿼리 행은 번호와 이름·값·삭제 동작의 관계가 한눈에 보이는 2단 배치를 사용한다.

## 호환성

- 기능은 고정 주소 `embed/url-parser-builder/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
