---
title: 텍스트·파일 해시 생성기
slug: hash-generator
type: converter
description: 텍스트나 파일을 선택해 SHA-256·SHA-384·SHA-512 해시값을 브라우저에서 계산합니다.
status: published
inputs:
  - id: source
    label: 텍스트 또는 파일
    type: text-file
  - id: algorithm
    label: 해시 알고리즘
    type: radio
---

## 기능
- Ctrl/⌘+Enter 해시 계산

- 텍스트와 파일 입력
- 텍스트 해시 계산 전 앞뒤 공백 제거
- SHA-256·SHA-384·SHA-512
- 기대 해시를 입력해 일치·불일치 검증
- 선택한 입력 원본과 파일 해제 상태 표시
- 대문자·소문자 출력
- 결과 복사
- SHA-256·SHA-384·SHA-512 동시 계산과 일괄 복사
- 해시 결과를 체크섬 TXT 파일로 저장
- 안전한 텍스트 예제를 불러와 SHA-256 즉시 계산
- 단일 알고리즘 SRI 값 복사와 해시 결과 영역 바로 이동
- 해시 결과에서 텍스트 입력으로 돌아가는 버튼과 Alt+U

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/hash-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 실제 확인 작업에 가까운 JSON 설정 예제를 즉시 해시할 수 있다.
## 2026-08-28 키보드 초기화

- `Alt + R`로 텍스트·파일·검증 입력을 초기화한다.
