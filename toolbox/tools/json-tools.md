---
title: JSON 도구
slug: json-tools
status: published
runtime: blogger-inline
description: JSON을 실시간으로 검사하고, 보기 좋게 정리하거나 한 줄로 압축합니다.
inputs:
  - key: json
    label: JSON 입력
    type: textarea
    required: true
  - key: mode
    label: 결과 방식
    type: radio
    options: [pretty, minify]
outputs:
  - formattedJson
---

# 기능

- 실시간 JSON 유효성 검사
- 잘못된 JSON의 줄·열 위치 안내
- 우측 결과 영역에서 오류 위치의 빨간 밑줄 미리보기
- 들여쓰기 정리와 한 줄 압축
- 결과 복사, JSON 파일 저장, 전체 비우기

# 실행 규칙

- 입력이 유효하면 선택한 결과 방식으로 즉시 출력한다.
- 결과 방식은 2개이므로 라디오 버튼으로 선택한다.
- JSON 파싱과 파일 생성은 브라우저 안에서만 수행하며 서버로 전송하지 않는다.
- 외부 라이브러리는 사용하지 않는다.
