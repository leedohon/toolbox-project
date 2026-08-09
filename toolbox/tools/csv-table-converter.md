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
- JSON·CSV·TSV·Markdown 표 복사와 저장
- 복사·저장 전에 빈 결과 안내
- 완전히 빈 행을 무시하거나 유지하는 선택
- 모든 셀의 앞뒤 공백을 한 번에 정리하는 선택
- 상품·수량·매출 CSV 예제를 불러와 JSON 변환 체험

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 입력·구분자·출력 형식이 바뀌면 이전 수동 복사 영역을 즉시 숨긴다.

## 호환성

- 기능은 고정 주소 `embed/csv-table-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
