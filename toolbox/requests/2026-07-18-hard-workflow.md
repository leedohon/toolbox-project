# 2026-07-18 하드 워크플로

## 확정 요청

- 작업 종류: 하드 자동 작업 처리
- 대상: 최근 두 차례 신규 제작에서 제외한 공개 도구 6개와 페이지 작업 3건
- 버전 단계: 기존 도구는 minimum, 신규 도구는 0.0.1v
- Blogger 게시: 완료된 변경만 공개 반영
- Git·배포: `main` 커밋·푸시와 GitHub Pages 공개 확인
- 종료 예약: 사용하지 않음

## 공개 도구 개선 6건

1. `qr-barcode-generator`: 전경색과 배경색이 같아 읽을 수 없는 결과의 저장을 막고 가까운 오류를 표시한다.
2. `json-tools`: 로컬 JSON 파일 선택과 드래그 앤 드롭 입력을 제공한다.
3. `base64-tools`: 큰 파일로 브라우저가 멈추지 않도록 파일 크기를 제한하고 오류를 안내한다.
4. `image-mosaic-tool`: 키보드로 파일 선택 영역을 열 수 있게 한다.
5. `date-calculator`: 동적으로 생성되는 결과·오류·복사 상태를 KOR / ENG 선택에 맞춘다.
6. `multipurpose-draw-game`: 공통 KOR / ENG 선택기와 저장 상태를 컨테이너에도 적용한다.

## 페이지 작업 3건

1. 은퇴한 `url-encoder-decoder`의 대체 도구를 `base64-tools`로 명시하고 기존 주소의 이중 언어 호환 안내를 완성한다.
2. 정규식 패턴을 브라우저에서 시험하고 일치 항목을 확인하는 `regex-tester`를 신규 공개한다.
3. 가로·세로 비율과 목표 크기를 계산하는 `aspect-ratio-calculator`를 신규 공개한다.

## 공통 결함 수정 2건

1. 공통 단순 도구 스타일에서 `select`의 키보드 포커스 표시가 빠진 문제를 수정한다.
2. 비활성화된 공통 버튼·입력의 상태가 불명확한 문제를 수정한다.

## 검증

- 영향도 규칙의 필수 검사와 릴리스 검사
- `IFRAME_HEIGHT_STALE`, `HIDDEN_GRID_OVERRIDE`, `SHARED_ASSET_CACHE_STALE` 회귀 검사
- 데스크톱과 375px 모바일의 가로 넘침, 버튼 줄바꿈, 오류·빈 상태, KOR / ENG, iframe 높이 확인
- Blogger 공개 반영, 카탈로그·버전 일치, Git·Pages 배포 확인

