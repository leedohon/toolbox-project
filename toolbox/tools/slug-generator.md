---
title: URL 슬러그 생성기
slug: slug-generator
type: converter
description: 제목이나 문구를 소문자 URL 경로에 쓰기 좋은 슬러그로 정리합니다.
status: published
inputs:
  - id: text
    label: 원본 문구
    type: textarea
  - id: separator
    label: 단어 구분자
    type: select
---

## 기능

- 한글·영문·숫자 유지
- 공백과 기호 정리
- 하이픈·밑줄 선택
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/slug-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
