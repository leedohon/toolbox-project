---
title: QR · 바코드 생성기
slug: qr-barcode-generator
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
---

# 기능

- QR 코드와 Code 128 바코드 생성
- 기본형과 둥근형 QR 스타일(세 위치 표시 마크 포함)
- 크기 조절 및 PNG·SVG 저장

# 게시 규칙

Blogger 게시글의 HTML 보기에 붙여 넣을 수 있도록 HTML, CSS, JavaScript를 하나의 조각으로 출력한다.
