---
title: 정규식 테스트 도구
slug: regex-tester
type: converter
description: 정규식 패턴과 테스트 문장을 입력해 일치 항목과 위치를 브라우저에서 바로 확인합니다.
status: published
inputs:
  - id: pattern
    label: 정규식 패턴
    type: text
  - id: flags
    label: 플래그
    type: checkbox
  - id: text
    label: 테스트 문장
    type: textarea
---

## 기능
- 테스트 문장 텍스트 파일 불러오기와 Ctrl/⌘+Enter 실행

- 정규식 패턴과 플래그 검사
- 일치 항목·위치 목록
- 일치 부분 하이라이트
- 찾은 문자열을 치환식으로 바꾼 결과 미리보기
- 정규식 패턴을 구분자로 사용해 텍스트 나누기
- 전체 찾기 플래그를 켠 경우와 끈 경우를 정확히 구분
- 결과 복사
- 일치 항목별 번호 캡처 그룹과 이름 있는 캡처 그룹 표시
- 이메일·숫자·URL 정규식 예제 빠른 불러오기
- IPv4 주소 정규식과 테스트 문장 예제

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/regex-tester/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 한국 휴대전화 번호를 점검하는 정규식과 테스트 문장을 한 번에 불러온다.
