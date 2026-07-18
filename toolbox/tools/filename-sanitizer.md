---
title: 안전한 파일명 정리기
slug: filename-sanitizer
type: converter
description: 파일명에서 사용할 수 없는 문자와 불필요한 공백을 정리해 복사 가능한 이름으로 바꿉니다.
status: published
inputs:
  - id: filename
    label: 원본 파일명
    type: text
  - id: separator
    label: 공백 처리
    type: radio
---

## 기능

- Windows·macOS 호환 문자 정리
- 확장자 보존
- 공백·구분자 선택
- 변경 내용 안내

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/filename-sanitizer/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
