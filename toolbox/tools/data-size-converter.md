---
title: 데이터 용량 단위 변환기
slug: data-size-converter
type: converter
description: 바이트·KB·MB·GB·KiB·MiB·GiB 용량을 SI와 IEC 기준으로 한 번에 변환합니다.
status: retired
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

- 모든 SI·IEC 데이터 단위 결과 기능을 `date-calculator`의 데이터 단위 분야로 통합했다.
- 공개 카탈로그에서는 제외하고 기존 게시글과 `embed/data-size-converter/` 주소는 통합 도구의 호환 진입점으로 유지한다.
- `replacementTool`은 `date-calculator`로 기록한다.
