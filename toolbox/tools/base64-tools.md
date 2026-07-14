---
title: Base64 도구
slug: base64-tools
type: converter
description: 텍스트와 파일을 Base64로 인코딩하거나 디코딩하고 결과를 저장합니다.
status: published
inputs:
  - key: mode
    label: 변환 모드
    type: radio
    options: [encode, decode]
  - key: content
    label: 원본 텍스트 또는 Base64
    type: textarea
    required: true
  - key: file
    label: 파일
    type: file
  - key: urlSafe
    label: URL-safe Base64
    type: checkbox
---

# 기능

- UTF-8 텍스트 Base64 인코딩과 디코딩
- 파일 선택 및 드래그 앤 드롭 Base64 변환
- 결과 복사와 디코딩 파일 다운로드
- URL-safe Base64 인코딩과 자동 디코딩

# 인터페이스

- 입력과 결과는 화면 크기와 관계없이 위아래 한 열로 배치한다.
- 도구는 iframe의 사용 가능한 가로 폭을 채우며 입력 영역이 비정상적으로 좁아지지 않아야 한다.
- 모바일에서는 버튼과 파일 입력이 자연스럽게 줄바꿈되고 충분한 터치 영역을 유지한다.

# 실행 규칙

- 모든 변환은 현재 브라우저 안에서 처리하고 서버로 전송하지 않는다.
- 파일 입력은 선택 버튼과 드래그 앤 드롭 영역을 함께 제공한다.
- URL-safe 인코딩은 `+`를 `-`, `/`를 `_`로 바꾸고 끝의 `=` 패딩을 제거한다.
- 디코딩은 일반 Base64와 URL-safe Base64를 자동으로 인식한다.
