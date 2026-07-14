---
title: 숫자뽑기
slug: number-picker
type: calculator
description: 숫자 범위와 개수를 정해 중복 허용 여부에 따라 무작위 숫자를 뽑습니다.
status: published
inputs:
  - id: min
    label: 최솟값
    type: number
  - id: max
    label: 최댓값
    type: number
  - id: count
    label: 뽑을 개수
    type: number
  - id: allowDuplicates
    label: 중복 허용
    type: checkbox
  - id: sort
    label: 오름차순 정렬
    type: checkbox
---

## 기능

- -1,000,000~1,000,000 정수 범위
- 최대 100개 숫자 추첨
- 중복 허용 및 정렬 선택, 결과 복사
