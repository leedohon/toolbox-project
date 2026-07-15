---
title: 편가르기
slug: team-divider
type: converter
description: 이름 목록을 무작위로 섞어 2~10개 팀에 최대한 균등하게 나눕니다.
status: retired
inputs:
  - id: members
    label: 참가자 이름
    type: repeatable-list
  - id: teamCount
    label: 팀 개수
    type: select
---

## 기능

- 2~100명 입력
- `+ 참가자 추가`, 행별 삭제와 빈칸 안내
- 2~10개 팀 선택
- 결과 팀 이름은 `팀 1, 팀 2…`로 자동 표시
- 팀별 인원 차이가 최대 1명인 무작위 배분
- 결과 복사 및 다시 나누기
- iframe에서 자동 복사가 차단되면 직접 선택해 복사할 결과 상자 표시
- 결과 코드 복사·같은 결과 열기·PNG 저장

## 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 동적으로 추가되는 입력 행과 결과까지 선택 언어로 표시한다.

## 통합

- 공개 카탈로그에서는 `multipurpose-draw-game`으로 대체하며 기존 결과 코드 호환 엔진으로 유지한다.
- 사용자 표시명은 `편가르기`로 고정하며 `다중팀`을 사용하지 않는다.
