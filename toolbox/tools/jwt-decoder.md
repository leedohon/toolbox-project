---
title: JWT 내용 확인기
slug: jwt-decoder
type: converter
description: JWT의 헤더와 페이로드를 서명 검증 없이 브라우저에서 읽기 좋게 확인합니다.
status: published
inputs:
  - id: token
    label: JWT 문자열
    type: textarea
---

## 기능
- JWT 입력 복귀 버튼과 `Alt + U`, 안전 예제 `Alt + S`, 시간 클레임 요약 복사
- 대표 클레임·시간·서명 미검증 주의사항을 한 번에 복사
- JWT 텍스트 파일 불러오기·저장과 Ctrl/⌘+Enter 내용 열기

- Base64URL 디코딩
- 헤더·페이로드 JSON
- exp·iat·nbf의 현지 시각과 만료·유효 시작까지 남은 시간 안내
- 발급자·대상·주체·토큰 ID와 알고리즘 대표 항목 요약
- 서명 미검증 경고
- 헤더와 페이로드 JSON 개별 복사
- 헤더와 페이로드 JSON을 한 번에 복사
- 헤더와 페이로드를 하나의 JSON 파일로 저장
- 실제 인증 정보가 없는 안전한 JWT 예제 불러오기

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/jwt-decoder/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 만료된 JWT 예제를 불러와 만료 안내를 곧바로 확인할 수 있다.
- `Alt + R`로 토큰 입력과 결과를 한 번에 초기화한다.
