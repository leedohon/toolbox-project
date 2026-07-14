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
  - id: strength
    label: 모자이크 강도
    type: range
---

## 기능

- PNG, JPEG, WebP 파일 선택 및 드래그 앤 드롭
- 파일 없이 바로 익히는 샘플 이미지 체험
- 마우스와 손가락 드래그 모자이크
- 브러시 크기와 모자이크 강도 조절
- 한 단계 되돌리기, 원본 초기화, PNG 저장

## 규칙

- 파일은 15MB 이하로 제한한다.
- 이미지 한 변은 5,000px 이하, 전체 픽셀은 20,000,000 이하로 제한한다.
- 이미지는 서버로 전송하지 않고 브라우저에서만 처리한다.
- 최대 100개의 브러시 동작을 보관한다.
