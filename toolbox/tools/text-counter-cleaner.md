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
- 연속 공백과 빈 줄을 바로 정리해 보는 예제

- 정리한 결과를 UTF-8 TXT 파일로 저장

- 공백 포함·제외 글자수
- 단어·줄·문장·문단·UTF-8 용량과 예상 읽기 시간
- 줄 공백·연속 공백·빈 줄 정리
- 원본 유지와 결과 복사
- 자주 나온 단어 상위 5개와 빈도 실시간 표시

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 자동 복사가 차단되어 대체 결과를 표시해도 모바일 입력을 강제로 선택하거나 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/text-counter-cleaner/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 잦은 줄바꿈과 빈 줄을 정리하는 문단 예제를 제공한다.
