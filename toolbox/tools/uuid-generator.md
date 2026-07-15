---
title: UUID 일괄 생성기
slug: uuid-generator
type: template-generator
description: 브라우저의 안전한 난수로 UUID v4를 한 번에 여러 개 만들고 원하는 형식으로 복사합니다.
status: published
inputs:
  - id: count
    label: 생성 개수
    type: number
  - id: format
    label: 출력 형식
    type: radio
---

## 기능

- UUID v4 1~100개 일괄 생성
- 기본·대문자·하이픈 제거 형식
- 중복 검사와 개수 요약
- 전체 복사·텍스트 저장

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/uuid-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
