---
title: IP·네트워크 주소 도구
slug: ip-network-calculator
type: calculator
description: IPv4 CIDR과 마스크, 주소 범위와 MAC 주소를 계산·검사하고 표준 형식으로 정리합니다.
status: published
inputs:
  - id: mode
    label: 작업 유형
    type: select
  - id: ipCidr
    label: IPv4/CIDR
    type: text
  - id: prefix
    label: CIDR 프리픽스
    type: number
  - id: startIp
    label: 시작 IPv4
    type: text
  - id: endIp
    label: 끝 IPv4
    type: text
  - id: mac
    label: MAC 주소
    type: text
  - id: targetIp
    label: 확인할 IPv4
    type: text
---

## 기능

- IPv4 CIDR 서브넷 계산
- 프리픽스·마스크·와일드카드 변환
- IP 범위 최소 CIDR 변환
- MAC 주소 검사·표준화
- IPv4와 부호 없는 정수·16진수·2진수 표현 변환
- IPv4 주소가 지정한 CIDR 네트워크에 포함되는지 검사
- /24·/26·/32 대표 프리픽스 빠른 적용
- 사설망 대역 확인에 자주 쓰는 /16 빠른 적용

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/ip-network-calculator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- CIDR 네트워크와 확인할 IPv4를 입력해 포함 여부와 전체 범위를 함께 확인한다.
