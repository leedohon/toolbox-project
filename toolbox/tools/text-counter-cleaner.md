---
title: 텍스트 정리·생성 도구
slug: text-counter-cleaner
type: converter
description: 글자 수·공백·목록·파일명·슬러그를 정리하고 테스트 문장을 생성합니다.
status: published
modules: [text-counter-cleaner, filename-sanitizer, lorem-ipsum-generator, slug-generator, line-sort-deduplicator]
inputs:
  - id: text
    label: 원본 텍스트
    type: textarea
  - id: cleanup
    label: 텍스트 정리 옵션
    type: checkbox
---

## 기능

- 공백 포함·제외 글자수
- 단어·줄·문장·UTF-8 용량
- 줄 공백·연속 공백·빈 줄 정리
- 원본 유지와 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/text-counter-cleaner/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
