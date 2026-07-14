---
title: JSON 도구
slug: json-tools
type: converter
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
  - excelTable
  - xlsxFile
  - csvFile
---

# 기능

- 실시간 JSON 유효성 검사
- 잘못된 JSON의 줄·열 위치 안내
- 결과 영역에서 오류 위치의 빨간 밑줄 미리보기
- 들여쓰기 정리와 한 줄 압축
- 결과 복사, JSON 파일 저장, 전체 비우기
- JSON 데이터의 Excel 표 미리보기와 실제 XLSX 파일 다운로드
- Excel 표 데이터를 UTF-8 CSV 파일로 다운로드

# 인터페이스

- JSON 입력, 정리 결과·오류 위치, Excel 표는 위에서 아래로 한 열 배치한다.
- 도구는 iframe의 사용 가능한 가로 폭을 채우고 입력·결과 영역이 비정상적으로 좁아지지 않아야 한다.
- 표가 넓을 때는 표 영역 안에서만 가로 스크롤을 제공한다.

# 실행 규칙

- 입력이 유효하면 선택한 결과 방식으로 즉시 출력한다.
- 결과 방식은 2개이므로 라디오 버튼으로 선택한다.
- JSON 파싱과 파일 생성은 브라우저 안에서만 수행하며 서버로 전송하지 않는다.
- 객체 배열은 행으로, 중첩 객체는 점 표기 열로, 일반 객체는 키·값 표로 변환한다.
- 중첩 배열은 JSON 문자열 셀로 저장하고 화면 표는 최대 100행까지 미리 보여준다.
- XLSX 생성에는 SheetJS Community Edition의 공식 브라우저 배포본을 사용한다.
- CSV는 한글이 스프레드시트에서 올바르게 열리도록 UTF-8 BOM을 포함한다.
