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
- 원문 입력 복귀 버튼과 `Alt + U`, 공백 정리 예제 `Alt + S`, 정리 결과 입력 재사용
- 자주 나온 단어 상위 5개와 빈도를 CSV 파일로 저장
- 원문 텍스트 파일 불러오기·저장과 Ctrl/⌘+Enter 정리
- 연속 공백과 빈 줄을 바로 정리해 보는 예제

- 정리한 결과를 UTF-8 TXT 파일로 저장

- 공백 포함·제외 글자수
- 단어·줄·문장·문단·UTF-8 용량과 예상 읽기 시간
- 줄 공백·연속 공백·빈 줄 정리
- 원본 유지와 결과 복사
- 자주 나온 단어 상위 5개와 빈도 실시간 표시
- 자주 나온 단어 상위 5개와 빈도를 탭 구분 형식으로 복사
- 최대 100,000자 입력량과 정리 전후 글자 수 변화 표시

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 자동 복사가 차단되어 대체 결과를 표시해도 모바일 입력을 강제로 선택하거나 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/text-counter-cleaner/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 정리 실행 뒤 원본·결과 글자 수와 감소·증가량을 즉시 안내한다.
- 주요 입력·옵션·버튼·결과 문구를 KOR / ENG 선택에 맞춘다.
- `Alt + R`로 입력을 초기화하고 `Ctrl/⌘ + Shift + S`로 정리 결과 TXT를 저장한다.
