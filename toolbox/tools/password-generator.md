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
- `Alt+L` 언어 전환·`lang` 직접 열기와 `Ctrl/⌘+Shift+C` 생성 결과 복사
- 생성한 비밀번호 묶음을 UTF-8 텍스트 파일로 저장
- 네 개의 영문 단어와 두 자리 숫자를 조합한 기억하기 쉬운 비밀번호 생성
- 일반 로그인에 바로 쓰는 16자 비밀번호 설정

- 모든 문자 그룹을 사용하는 32자 강력 비밀번호 프리셋

- 8~64자 길이 조절
- 소문자·대문자·숫자·특수문자 선택
- 헷갈리는 문자 제외
- 암호학적 난수와 복사 대체 UI
- 같은 설정으로 비밀번호 1~20개 일괄 생성과 한 번에 복사
- 문자 그룹이 없으면 이전 결과를 지우고 복사를 차단
- 웹사이트용 안전 설정을 한 번에 적용하는 프리셋

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 생성된 결과가 있을 때만 복사할 수 있다.
- 설정을 바꾸어 새 결과를 만들면 이전 수동 복사 영역을 숨긴다.

## 호환성

- 기능은 고정 주소 `embed/password-generator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 20자 비밀번호 5개를 한 번에 생성하는 묶음 프리셋을 제공한다.
## 2026-08-28 통합 기능 전환

- `Alt + Shift + 좌우 방향키`로 비밀번호와 UUID 기능을 전환한다.
- 선택한 기능을 URL의 `module` 값에 반영한다.
