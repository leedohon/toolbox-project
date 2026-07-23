---
title: 비밀번호·UUID 생성기
slug: password-generator
type: template-generator
description: 안전한 무작위 비밀번호와 UUID v4를 필요한 형식과 개수로 만듭니다.
status: published
modules: [password-generator, uuid-generator]
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
- 문자 그룹이 없으면 이전 결과를 지우고 복사를 차단

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 생성된 결과가 있을 때만 복사할 수 있다.

## 호환성

- 기능은 고정 주소 `embed/password-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
