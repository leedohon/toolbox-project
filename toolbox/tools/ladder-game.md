---
title: 사다리게임
slug: ladder-game
type: converter
description: 참가자와 결과를 입력해 무작위 사다리 경로와 매칭 결과를 만듭니다.
status: retired
inputs:
  - id: participants
    label: 참가자
    type: repeatable-pair-list
  - id: outcomes
    label: 결과
    type: repeatable-pair-list
---

## 기능

- 2~12명의 참가자와 같은 수의 결과 입력
- `+ 참가자와 결과 추가`, 행별 삭제와 빈칸 안내
- 실제 사다리 가로선 생성과 경로 계산
- 전체 매칭 결과 확인 및 다시 섞기
- 결과 코드 복사·같은 결과 열기·PNG 저장

## 규칙

- 빈 줄은 제외하고 앞뒤 공백을 제거한다.
- 참가자와 결과 수가 다르면 생성하지 않는다.
- 난수는 브라우저의 `crypto.getRandomValues`를 사용한다.

## 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 동적으로 추가되는 입력 행과 결과까지 선택 언어로 표시한다.

## 통합

- 공개 카탈로그에서는 `multipurpose-draw-game`으로 대체하며 기존 결과 코드 호환 엔진으로 유지한다.
