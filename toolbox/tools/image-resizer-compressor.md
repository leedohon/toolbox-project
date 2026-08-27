---
title: 이미지 크기·압축·DPI 도구
slug: image-resizer-compressor
type: converter
description: 이미지 크기·저장 품질을 바꾸거나 출력 크기에 맞는 DPI·PPI를 계산합니다.
status: published
modules: [image-resizer-compressor, dpi-ppi-calculator]
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
- 복사한 이미지를 클립보드 버튼 또는 Ctrl+V로 바로 불러오기
- 변환 이미지 저장 파일명을 직접 지정하고 선택한 형식의 확장자 자동 적용
- 이메일 첨부용 긴 변 1600px·JPEG 75% 빠른 설정


- PNG·JPEG·WebP 드래그 앤 드롭
- 가로·세로 크기와 원본 비율 유지
- JPEG·WebP 품질 조절
- 변환 전후 용량 비교와 저장
- 키보드로 실행 가능한 파일 선택 버튼과 원본 파일명 보존
- 원본 대비 25·50·75·100% 크기 프리셋과 직접 입력 모드
- 원본 비율을 유지하는 긴 변 1280px·1920px 프리셋
- 긴 변 1280px·WebP·품질 80%를 한 번에 적용하는 웹용 권장 설정

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 파일 선택 버튼과 드래그 앤 드롭은 같은 검증 흐름을 사용한다.
- 크기·형식·품질 설정이 바뀌면 이전 변환 다운로드를 즉시 무효화한다.

## 호환성

- 기능은 고정 주소 `embed/image-resizer-compressor/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 공유용 긴 변 1080px·WebP 85% 설정을 한 번에 적용한다.
## 2026-08-28 통합 기능 전환

- `Alt + Shift + 좌우 방향키`로 이미지 크기·압축·DPI 기능을 전환한다.
- 선택한 기능을 URL의 `module` 값에 반영한다.
