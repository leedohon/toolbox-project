---
title: 텍스트 정보 추출기
slug: text-extractor-tool
type: converter
description: 긴 글에서 이메일, URL·도메인, 전화번호 또는 해시태그·멘션을 골라 중복 없이 정리합니다.
status: published
inputs:
  - id: mode
    label: 추출 유형
    type: radio
  - id: text
    label: 원본 텍스트
    type: textarea
---

## 기능

- 이메일 주소 추출
- URL·도메인 추출
- 전화번호 추출
- 해시태그·멘션 추출
- 전체 일치·고유 항목·제거된 중복 수 표시
- 추출 결과를 UTF-8 TXT 파일로 저장
- 이메일·URL·해시태그·멘션이 섞인 연락처 예제

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/text-extractor-tool/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 여러 주소가 섞인 문장에서 URL만 추출하는 예제를 제공한다.
