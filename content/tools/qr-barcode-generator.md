---
title: QR · 바코드 생성기
slug: qr-barcode-generator
type: converter
status: published
description: 텍스트나 URL을 기본형 또는 둥근 스타일의 QR 코드와 Code 128 바코드로 만듭니다.
features:
  - QR 코드 및 Code 128 바코드 생성
  - 기본형 및 둥근형 QR 스타일
  - 크기 조절과 이미지 저장
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

# 생성 규칙

- QR 코드는 입력한 내용을 오류 정정 수준 M으로 인코딩한다.
- 기본형은 사각 모듈을 사용하고, 둥근형은 탐색 패턴을 제외한 데이터 모듈에 둥근 모양을 사용한다.
- 바코드는 Code 128 형식으로 생성한다.

# 기능 안내

- 텍스트와 URL을 QR 코드 또는 바코드로 만들 수 있다.
- QR 코드는 기본형과 둥근형 중 선택할 수 있다.
- 생성한 결과는 QR은 PNG, 바코드는 SVG 형식으로 저장할 수 있다.
