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
- iframe에서 자동 복사가 차단되면 직접 선택해 복사할 결과 상자 표시
- 로또 6/45와 주사위 1~6 빠른 설정
- 결과 코드 복사·같은 결과 열기·PNG 저장

## 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 모든 조작·상태·오류 문구를 선택 언어로 표시한다.
