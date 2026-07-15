---
title: URL 인코더·디코더
slug: url-encoder-decoder
type: converter
description: 주소나 문장을 URL에 안전한 형식으로 인코딩하고 원문으로 디코딩합니다.
status: retired
inputs:
  - id: mode
    label: 변환 방식
    type: radio
  - id: scope
    label: 처리 범위
    type: radio
  - id: input
    label: 원본 입력
    type: text
---

## 기능

- 쿼리 값·문장용 `encodeURIComponent`와 주소 전체용 `encodeURI` 지원
- 대응하는 URL 디코딩과 잘못된 퍼센트 문자열 안내
- 입력·결과 바꾸기, 결과 복사, 초기화
- 모든 입력은 브라우저 안에서만 처리
- KOR / ENG 화면 전환

## 제한

- 입력은 최대 100,000자로 제한한다.

## 통합 상태

- 동일한 입력·결과 흐름을 가진 Base64 도구와 통합했다.
- 공개 카탈로그에서는 제외하고 기존 게시글 주소는 통합 텍스트 인코더·디코더의 호환 진입점으로 유지한다.
