---
title: chmod 권한 계산기
slug: chmod-calculator
type: calculator
description: 소유자·그룹·기타 사용자의 읽기·쓰기·실행 조합을 숫자와 기호 권한으로 확인합니다.
status: retired
replacementTool: http-status-lookup
inputs:
  - id: owner
    label: 소유자 권한
    type: select
  - id: group
    label: 그룹 권한
    type: select
  - id: other
    label: 기타 권한
    type: select
---

## 기능

- 0~7 권한 선택
- 숫자 권한
- rwx 기호 권한
- 명령 예시

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/chmod-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
