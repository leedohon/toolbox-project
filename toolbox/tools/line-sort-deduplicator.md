---
title: 줄 정렬·중복 제거기
slug: line-sort-deduplicator
type: converter
description: 여러 줄 목록을 가나다·알파벳순으로 정렬하고 같은 줄을 한 번만 남깁니다.
status: retired
replacementTool: text-counter-cleaner
inputs:
  - id: lines
    label: 줄 목록
    type: textarea
  - id: order
    label: 정렬 순서
    type: select
  - id: unique
    label: 중복 처리
    type: select
---

## 기능

- 오름차순·내림차순
- 대소문자 무시 중복 제거
- 빈 줄 정리
- 전체 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/line-sort-deduplicator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
