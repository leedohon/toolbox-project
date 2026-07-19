---
title: Cron 표현식 설명기
slug: cron-expression-explainer
type: converter
description: 5개 항목의 기본 Cron 표현식을 분·시·일·월·요일별 쉬운 문장으로 나누어 설명합니다.
status: published
inputs:
  - id: expression
    label: Cron 표현식
    type: text
---

## 기능

- 5필드 Cron
- 별표·간격·목록·숫자
- 항목별 설명
- 결과 복사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/cron-expression-explainer/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
