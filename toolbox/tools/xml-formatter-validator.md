---
title: XML 검사·정리 도구
slug: xml-formatter-validator
type: converter
description: XML 문법 오류를 확인하고 들여쓰기 정리·한 줄 압축 결과를 브라우저에서 만듭니다.
status: published
inputs:
  - id: xml
    label: XML 입력
    type: textarea
  - id: mode
    label: 결과 방식
    type: radio
---

## 기능
- XML 원문 파일 불러오기·저장과 Ctrl/⌘+Enter 검사

- XML 문법 오류 안내
- 2칸·4칸 들여쓰기
- 한 줄 압축
- 모드 선택을 따로 바꾸지 않고 한 줄 압축 결과를 즉시 생성
- 결과 요소 수와 문자 수 요약
- 루트 요소 이름과 전체 속성 수 요약
- 결과 복사·파일 저장
- 변환 결과를 입력으로 옮겨 이어서 편집
- RSS 2.0 구조 예제를 불러와 정리·검사

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/xml-formatter-validator/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 네임스페이스가 포함된 XML 예제로 정리와 검증을 바로 시험할 수 있다.
- `Alt + R`로 입력을 초기화하고 `Ctrl/⌘ + Shift + S`로 변환 결과 XML을 저장한다.
