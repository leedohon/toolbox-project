---
title: 이미지 모자이크 도구
slug: image-mosaic-tool
type: converter
description: 이미지를 불러온 뒤 숨기고 싶은 영역을 드래그해 모자이크 처리하고 PNG로 저장합니다.
status: published
inputs:
  - id: image
    label: 이미지 파일
    type: file
  - id: brushSize
    label: 브러시 크기
    type: range
  - id: selectionMode
    label: 선택 도구
    type: radio
  - id: strength
    label: 모자이크 강도
    type: range
---

## 기능

- PNG, JPEG, WebP 파일 선택 및 드래그 앤 드롭
- 파일 없이 바로 익히는 샘플 이미지 체험
- 마우스와 터치로 브러시 칠하기 또는 사각형 범위 선택
- 사각형 드래그 중 선택 범위 미리보기, 종료 시 범위 전체 적용
- 브러시 크기와 모자이크 강도 조절
- 한 단계 되돌리기, 원본 초기화, PNG 저장

## 규칙

- 파일은 15MB 이하로 제한한다.
- 이미지 한 변은 5,000px 이하, 전체 픽셀은 20,000,000 이하로 제한한다.
- 이미지는 서버로 전송하지 않고 브라우저에서만 처리한다.
- 브러시와 사각형 적용을 합해 최대 100개의 되돌리기 단계를 보관한다.

## 공통 언어

- 공통 `KOR / ENG` 선택기를 사용하며 파일 안내·오류·편집 상태까지 선택 언어로 표시한다.
