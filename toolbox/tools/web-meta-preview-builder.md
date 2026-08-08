---
title: 웹 메타·공유 미리보기
slug: web-meta-preview-builder
type: template-generator
description: 웹페이지 제목과 설명, 주소와 이미지를 입력해 검색·공유 미리보기와 메타 태그를 함께 만듭니다.
status: published
inputs:
  - id: title
    label: 페이지 제목
    type: text
  - id: description
    label: 페이지 설명
    type: textarea
  - id: url
    label: 대표 주소
    type: text
  - id: image
    label: 공유 이미지 주소
    type: text
  - id: robots
    label: 검색 로봇 설정
    type: radio
  - id: imageAlt
    label: 공유 이미지 대체 설명
    type: text
---

## 기능

- 검색 제목·설명 미리보기
- Open Graph 태그 생성
- Twitter/X 카드 태그 생성
- canonical·robots 메타 생성
- 제목·설명 길이의 권장 범위 판정
- WebPage JSON-LD 구조화 데이터 생성
- 공유 이미지 대체 설명과 og:image:alt·twitter:image:alt 생성

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/web-meta-preview-builder/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
