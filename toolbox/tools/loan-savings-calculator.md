---
title: 대출·저축 계산기
slug: loan-savings-calculator
type: calculator
description: 대출 상환액과 복리 성장, 월 적립식 예상액과 목표 금액에 필요한 납입액을 계산합니다.
status: published
inputs:
  - id: mode
    label: 계산 유형
    type: radio
  - id: loanAmount
    label: 대출 원금
    type: number
  - id: startAmount
    label: 시작 금액
    type: number
  - id: targetAmount
    label: 목표 금액
    type: number
  - id: monthlyDeposit
    label: 월 납입액
    type: number
  - id: annualRate
    label: 연 이율
    type: number
  - id: months
    label: 기간
    type: number
---

## 기능

- 대출 상환 방식 비교
- 일시금 복리 성장
- 월 적립식 저축 예상액
- 목표 금액 월납입액 역산

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/loan-savings-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
