---
title: 날짜 계산기
slug: date-calculator
type: calculator
description: 두 날짜 사이의 일수를 계산하거나 기준일에서 원하는 일수를 더하고 뺍니다.
status: published
inputs:
  - id: mode
    label: 계산 방식
    type: radio
  - id: startDate
    label: 시작일
    type: date
  - id: endDate
    label: 종료일
    type: date
  - id: days
    label: 더하거나 뺄 일수
    type: number
---

## 기능

- 두 날짜 사이의 절대 일수와 앞뒤 관계 표시
- 종료일 포함 여부 선택
- 기준일에 양수 또는 음수 일수 적용
- 계산 날짜의 요일 표시와 결과 복사
- 윤년과 월 길이를 브라우저 UTC 날짜 계산으로 안전하게 처리
- KOR / ENG 화면 전환

## 제한

- 더하거나 뺄 일수는 -100,000부터 100,000 사이의 정수로 제한한다.
