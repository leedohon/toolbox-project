---
title: QR · 바코드 생성기
slug: qr-barcode-generator
type: converter
status: published
runtime: blogger-inline
description: 텍스트나 URL을 기본형 또는 둥근형 QR 코드, Code 128 바코드로 만듭니다.
inputs:
  - key: content
    label: 텍스트 또는 URL
    type: text
    required: true
  - key: outputType
    label: 생성 유형
    type: radio
    options: [qr, barcode]
  - key: qrStyle
    label: QR 스타일
    type: radio
    options: [basic, rounded]
  - key: size
    label: 크기
    type: range
  - key: foregroundColor
    label: 전경색
    type: color
  - key: backgroundColor
    label: 배경색
    type: color
  - key: displayBarcodeText
    label: 바코드 하단 텍스트 표시
    type: checkbox
---

# 기능

- QR 코드와 Code 128 바코드 생성
- 기본형과 둥근형 QR 스타일(세 위치 표시 마크 포함)
- 크기 조절 및 PNG·SVG 저장
- QR 코드와 바코드의 전경색·배경색 설정
- Code 128 바코드 하단 텍스트 표시 여부 선택
- 입력과 모든 설정을 기본값으로 한 번에 초기화

# 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 모든 조작·상태·오류 문구를 선택 언어로 표시한다.
- 선택 언어는 다른 도구와 공유해 유지한다.

# 게시 규칙

Blogger 게시글의 HTML 보기에 붙여 넣을 수 있도록 HTML, CSS, JavaScript를 하나의 조각으로 출력한다.
