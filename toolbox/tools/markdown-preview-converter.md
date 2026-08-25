---
title: 마크다운 작성 도구
slug: markdown-preview-converter
type: converter
description: 마크다운 문서를 미리 보고 HTML로 변환하거나 표 문법을 빠르게 만듭니다.
status: published
modules: [markdown-preview-converter, markdown-table-generator]
inputs:
  - id: markdown
    label: 마크다운 입력
    type: textarea
  - id: preview
    label: 미리보기
    type: output
---

## 기능
- 마크다운·텍스트 파일 불러오기와 Ctrl/⌘+Enter HTML 복사

- 제목·목록·인용·코드·링크 미리보기
- 안전한 HTML 변환
- HTML 결과 복사·파일 저장
- 단어·예상 읽기 시간·제목·링크 수 문서 구조 통계
- 입력과 동시에 실시간 갱신
- 문서 제목 구조를 목차로 표시하고 텍스트 목차 복사
- 제목·사용 방법·링크 구조가 포함된 README 예제 불러오기

## 실행 규칙

- 입력과 결과는 현재 브라우저 안에서만 처리한다.
- 장문 마크다운 입력과 실시간 미리보기는 화면 크기와 관계없이 위/아래 한 열로 배치한다.
- 긴 미리보기와 변환 HTML은 각각 읽기 가능한 최대 높이 안에서 스크롤하며 문서 전체 길이만큼 페이지를 무한 확장하지 않는다.
- 모바일에서는 오류나 초기화 뒤 입력칸에 자동 포커스하지 않는다.
- 입력이 비어 있으면 빈 HTML 파일을 저장하거나 복사하지 않고 입력 가까이에서 안내한다.

## 호환성

- 기능은 고정 주소 `embed/markdown-preview-converter/`와 독립 `tool.js` 모듈로 제공한다.
- 공통 CSS, KOR / ENG, 모바일 포커스 방지, iframe 높이 동기화 인터페이스를 재사용한다.

## 이번 개선

- 회의록 구조를 바로 입력하는 KOR / ENG 예제 버튼을 제공한다.
- 도입·본문·마무리를 갖춘 블로그 글 개요 예제를 제공한다.
