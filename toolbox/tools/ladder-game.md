---
title: 사다리게임
slug: ladder-game
type: converter
description: 참가자와 결과를 입력해 무작위 사다리 경로와 매칭 결과를 만듭니다.
status: published
inputs:
  - id: participants
    label: 참가자
    type: textarea
  - id: outcomes
    label: 결과
    type: textarea
---

## 기능

- 2~12명의 참가자와 같은 수의 결과 입력
- 실제 사다리 가로선 생성과 경로 계산
- 전체 매칭 결과 확인 및 다시 섞기

## 규칙

- 빈 줄은 제외하고 앞뒤 공백을 제거한다.
- 참가자와 결과 수가 다르면 생성하지 않는다.
- 난수는 브라우저의 `crypto.getRandomValues`를 사용한다.
