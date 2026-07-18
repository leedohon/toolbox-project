---
title: 다용도 계산기
slug: date-calculator
type: calculator
description: 일반 사칙연산과 길이, 넓이, 부피, 무게, 속도, 시간, 데이터 단위 및 날짜 계산을 한 화면에서 처리합니다.
status: published
inputs:
  - id: calculatorType
    label: 계산 종류
    type: radio
    options: [general, unit, date]
  - id: category
    label: 단위 분야
    type: select
  - id: operator
    label: 연산
    type: radio
    options: [add, subtract, multiply, divide]
  - id: leftValue
    label: 첫 번째 값
    type: number
  - id: rightValue
    label: 두 번째 값
    type: number
---

## 기능

- 일반 숫자의 덧셈, 뺄셈, 곱셈, 나눗셈
- 길이, 넓이, 부피, 무게, 속도, 시간, 데이터 단위 간 환산 사칙연산
- 데이터 분야에서는 첫 번째 값의 B·KB·MB·GB·TB와 KiB·MiB·GiB·TiB 전체 결과를 함께 표시
- mm, cm, m, km, inch, ft, yd, mile 등 자주 쓰는 다양한 단위
- 입력과 결과를 소수점 둘째 자리까지 처리
- 두 날짜 차이, 종료일 포함, 기준일에 날짜 더하기·빼기
- 결과 복사와 KOR / ENG 화면 전환

## 실행 규칙

- 단위 계산은 두 입력값을 결과 단위로 각각 환산한 다음 선택 연산을 적용한다.
- 데이터 단위에서는 1000배 SI와 1024배 IEC 결과를 바이트 기준으로 함께 계산하고 결과 복사에 포함한다.
- 곱셈과 나눗셈은 결과 단위의 물리 차원이 달라질 수 있으므로 선택 단위 기준 계산값으로 안내한다.
- 입력은 소수점 둘째 자리까지만 허용하고 결과도 둘째 자리에서 반올림한다.
- 0으로 나누기는 실행하지 않는다.
- 모바일에서는 초기화나 오류 뒤 입력칸에 자동 포커스하지 않는다.
- 계산 결과, 입력 오류, 복사와 초기화 상태처럼 동적으로 생성되는 문구도 선택한 KOR / ENG 언어로 표시한다.
