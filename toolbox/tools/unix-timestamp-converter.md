---
title: Unix 시간 변환기
slug: unix-timestamp-converter
type: converter
description: Unix 초·밀리초와 읽기 쉬운 지역 날짜·UTC 시간을 서로 변환합니다.
status: retired
replacementTool: date-calculator
inputs:
  - id: timestamp
    label: Unix 시간
    type: text
  - id: datetime
    label: 날짜와 시간
    type: datetime-local
---

## 기능

- 초·밀리초 자동 판별
- 지역 날짜와 UTC 동시 표시
- 날짜에서 Unix 초·밀리초 생성
- 현재 시간 입력과 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/unix-timestamp-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
