---
title: 정규식 테스트 도구
slug: regex-tester
type: converter
description: 정규식 패턴과 테스트 문장을 입력해 일치 항목과 위치를 브라우저에서 바로 확인합니다.
status: published
inputs:
  - id: pattern
    label: 정규식 패턴
    type: text
  - id: flags
    label: 플래그
    type: checkbox
  - id: text
    label: 테스트 문장
    type: textarea
---

## 기능

- 정규식 패턴과 플래그 검사
- 일치 항목·위치 목록
- 일치 부분 하이라이트
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/regex-tester/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
