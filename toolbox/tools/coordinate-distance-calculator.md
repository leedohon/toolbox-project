---
title: 좌표·거리 계산기
slug: coordinate-distance-calculator
type: calculator
description: 위도·경도 표기를 바꾸고 두 좌표의 대권거리, 방위각과 지리적 중간점을 계산합니다.
status: published
inputs:
  - id: mode
    label: 작업 유형
    type: radio
  - id: lat1
    label: 출발 위도
    type: number
  - id: lon1
    label: 출발 경도
    type: number
  - id: lat2
    label: 도착 위도
    type: number
  - id: lon2
    label: 도착 경도
    type: number
  - id: decimal
    label: 십진 좌표
    type: number
  - id: axis
    label: 좌표 축
    type: radio
  - id: degrees
    label: 도
    type: number
  - id: minutes
    label: 분
    type: number
  - id: seconds
    label: 초
    type: number
  - id: direction
    label: 방향
    type: radio
---

## 기능

- 십진 좌표↔도·분·초 변환
- 두 좌표 간 대권거리
- 초기 방위각·나침반 방향
- 두 좌표의 지리적 중간점
- 출발 좌표와 도착 좌표를 한 번에 교환

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/coordinate-distance-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
