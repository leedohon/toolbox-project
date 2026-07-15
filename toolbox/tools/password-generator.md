---
title: 안전 비밀번호 생성기
slug: password-generator
type: template-generator
description: 길이와 문자 구성을 선택해 브라우저 안에서 안전한 무작위 비밀번호를 만듭니다.
status: published
inputs:
  - id: length
    label: 비밀번호 길이
    type: range
  - id: groups
    label: 포함할 문자
    type: checkbox
---

## 기능

- 8~64자 길이 조절
- 소문자·대문자·숫자·특수문자 선택
- 헷갈리는 문자 제외
- 암호학적 난수와 복사 대체 UI

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/password-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
