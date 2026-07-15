---
title: 텍스트 인코더·디코더
slug: base64-tools
type: converter
description: Base64와 URL 인코딩·디코딩을 한 화면에서 처리하고 Base64 파일 변환을 지원합니다.
status: published
inputs:
  - key: format
    label: 변환 형식
    type: radio
    options: [base64, url]
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

- Base64와 URL 인코딩·디코딩 형식 선택
- URL 쿼리 값·문장과 주소 전체 처리 범위 구분
- UTF-8 텍스트 Base64 인코딩과 디코딩
- 파일 선택 및 드래그 앤 드롭 Base64 변환
- 결과 복사와 디코딩 파일 다운로드
- URL-safe Base64 인코딩과 자동 디코딩

# 인터페이스

- `assets/simple-tools.css`의 스카이블루 토큰과 공통 입력·버튼·상태 클래스를 베이스 스타일로 사용한다.
- Base64에만 필요한 파일 드롭과 다운로드 배치만 `assets/base64-tools.css`에서 확장하고 공통 색상·버튼 스타일을 다시 정의하지 않는다.
- 입력과 결과는 화면 크기와 관계없이 위아래 한 열로 배치한다.
- 도구는 iframe의 사용 가능한 가로 폭을 채우며 입력 영역이 비정상적으로 좁아지지 않아야 한다.
- 모바일에서는 버튼과 파일 입력이 자연스럽게 줄바꿈되고 충분한 터치 영역을 유지한다.

# 실행 규칙

- 모든 변환은 현재 브라우저 안에서 처리하고 서버로 전송하지 않는다.
- 파일 입력은 선택 버튼과 드래그 앤 드롭 영역을 함께 제공한다.
- URL-safe 인코딩은 `+`를 `-`, `/`를 `_`로 바꾸고 끝의 `=` 패딩을 제거한다.
- 디코딩은 일반 Base64와 URL-safe Base64를 자동으로 인식한다.
- 현재 결과를 다음 입력으로 옮기고 반대 변환 모드로 전환할 수 있다.

# 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 모든 조작·상태·오류 문구를 선택 언어로 표시한다.
