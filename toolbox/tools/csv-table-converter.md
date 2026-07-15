---
title: CSV 표 보기·변환기
slug: csv-table-converter
type: converter
description: CSV·TSV 텍스트를 표로 확인하고 JSON 또는 다른 구분자 형식으로 변환합니다.
status: published
inputs:
  - id: csv
    label: CSV 또는 TSV 입력
    type: textarea
  - id: delimiter
    label: 구분자
    type: select
---

## 기능

- 쉼표·탭·세미콜론 자동 판별
- 따옴표와 줄바꿈 포함 셀 처리
- 최대 100행 표 미리보기
- JSON·CSV·TSV 복사와 저장

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/csv-table-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
