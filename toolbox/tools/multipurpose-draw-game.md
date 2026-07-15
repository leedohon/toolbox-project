---
title: 다용도 뽑기게임
slug: multipurpose-draw-game
type: template-generator
description: 사다리, 돌림판, 숫자뽑기와 편가르기를 한 화면에서 선택해 실행합니다.
status: published
inputs:
  - id: mode
    label: 게임 선택
    type: radio
---

## 기능

- 사다리, 돌림판, 숫자뽑기, 편가르기 네 모드
- 4개 이하 선택지에 맞춘 라디오 카드형 모드 선택
- 모드 전환 뒤에도 각 모듈의 입력과 결과 상태 유지
- 각 모드의 KOR / ENG, 결과 코드 복원, PNG 저장과 복사 대체 처리 유지
- 브라우저 안에서만 입력과 무작위 결과 처리

## 모듈 구조

- 공개 진입점: `embed/multipurpose-draw-game/index.html`
- 모듈 등록: `embed/multipurpose-draw-game/modules.json`
- 등록 계약: `toolbox/guides/tool-module-compatibility.md`
- 기존 네 놀이 엔진을 호환 모듈로 재사용해 이미 공유된 결과 코드를 보존한다.

## 명칭

- 카테고리: `다용도 펀박스`
- 도구명: `다용도 뽑기게임`
- 팀 배정 모드의 공개 명칭은 `편가르기`이며 `다중팀`을 사용하지 않는다.

