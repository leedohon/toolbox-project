---
title: 텍스트 비교·차이 확인기
slug: text-diff-checker
type: converter
description: 원본과 수정본을 줄 단위로 비교해 추가·삭제·변경된 내용을 한눈에 표시합니다.
status: published
inputs:
  - id: original
    label: 원본 텍스트
    type: textarea
  - id: revised
    label: 수정한 텍스트
    type: textarea
---

## 기능

- 줄 단위 추가·삭제·동일 구분
- 변경 수와 일치율 요약
- 공백·대소문자 무시 선택
- 비교 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 원본과 수정본 장문 입력은 데스크톱과 모바일 모두 위/아래 한 열, 전체 폭으로 배치한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/text-diff-checker/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
