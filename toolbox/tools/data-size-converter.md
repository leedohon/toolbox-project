---
title: 데이터 용량 단위 변환기
slug: data-size-converter
type: converter
description: 바이트·KB·MB·GB·KiB·MiB·GiB 용량을 SI와 IEC 기준으로 한 번에 변환합니다.
status: published
inputs:
  - id: value
    label: 용량 값
    type: number
  - id: unit
    label: 입력 단위
    type: select
---

## 기능

- SI·IEC 단위 지원
- 바이트 기준 정밀 계산
- 모든 단위 동시 결과
- 소수 자릿수 선택

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/data-size-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
