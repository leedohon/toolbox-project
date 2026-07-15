---
title: 이미지 크기·용량 변환기
slug: image-resizer-compressor
type: converter
description: 이미지 크기와 저장 형식·품질을 바꿔 용량을 줄이고 바로 저장합니다.
status: published
inputs:
  - id: file
    label: 이미지 파일
    type: file
  - id: size
    label: 가로·세로 크기
    type: number
  - id: format
    label: 저장 형식
    type: select
---

## 기능

- PNG·JPEG·WebP 드래그 앤 드롭
- 가로·세로 크기와 원본 비율 유지
- JPEG·WebP 품질 조절
- 변환 전후 용량 비교와 저장

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.

## 호환성

- 기능은 고정 주소 `embed/image-resizer-compressor/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.
