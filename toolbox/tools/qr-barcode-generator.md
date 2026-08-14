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
- 이름·전화번호·이메일을 바꿔 쓰는 vCard 연락처 QR 예제
- Wi-Fi 접속 형식 예제를 불러와 네트워크 이름과 비밀번호를 바꿔 QR로 생성
- 최대 420px 고해상도 크기를 한 번에 적용하는 빠른 설정

- 전경색과 배경색을 검정·흰색 고대비 조합으로 즉시 맞추기

- QR 코드와 Code 128 바코드 생성
- 기본형과 둥근형 QR 스타일(세 위치 표시 마크 포함)
- 크기 조절 및 PNG·SVG 저장
- QR 코드와 바코드의 전경색·배경색 설정
- Code 128 바코드 하단 텍스트 표시 여부 선택
- 입력과 모든 설정을 기본값으로 한 번에 초기화
- QR 코드 오류 복원 수준(L·M·Q·H) 선택과 입력 길이 안내
- 전경색과 배경색을 한 번에 교환

# 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 모든 조작·상태·오류 문구를 선택 언어로 표시한다.
- 선택 언어는 다른 도구와 공유해 유지한다.

# 게시 규칙

Blogger 게시글의 HTML 보기에 붙여 넣을 수 있도록 HTML, CSS, JavaScript를 하나의 조각으로 출력한다.

# 2026-07-18 정확성 규칙

- 전경색과 배경색이 같으면 읽을 수 없는 결과를 생성·저장하지 않고 색상을 다르게 선택하도록 안내한다.
- 오류 복원 수준은 QR 코드에만 적용하며 바코드 모드에서는 숨긴다.
- 초기화 뒤 모바일 입력창에 자동 포커스하지 않는다.

# 2026-07-19 문서 식별

- 실행 페이지의 문서 제목을 항상 제공해 브라우저 탭과 보조기술에서 도구명을 식별할 수 있게 한다.

## 이번 개선

- 화면 공유에 쓰기 좋은 300px 크기를 한 번에 적용한다.
