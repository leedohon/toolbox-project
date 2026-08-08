# 2026-08-09 하드 워크플로 1회차

## 정규화

- 작업 종류: hard
- 대상 도구: qr-barcode-generator, json-tools, multipurpose-draw-game, password-generator, image-resizer-compressor, csv-table-converter
- 버전 단계: 사용자 기능 추가 대상은 minor
- Blogger 게시: 기존 공개 글 6개 갱신
- Git·배포: 독립 커밋, main 푸시, GitHub Pages 확인
- 종료 예약: 요청 없음

## 사용자 노출 개선 6건

1. QR 코드 오류 복원 수준과 입력 길이 안내
2. JSON Pointer로 중첩 값 즉시 찾기
3. 뽑기게임 모드 선택의 방향키·Home·End 이동
4. 비밀번호 1~20개 일괄 생성
5. 이미지 원본 대비 25·50·75·100% 크기 프리셋
6. CSV·TSV 변환에서 빈 행 포함 여부 선택

## 통합 기능 3건

- QR 오류 복원 수준 선택을 기존 생성기에 통합
- JSON Pointer 조회를 기존 JSON 검사·변환 흐름에 통합
- 비밀번호 일괄 생성을 기존 비밀번호·UUID 허브에 통합

## 공통 수정 2건

- 초기화·복사 대체 처리 뒤 모바일 강제 포커스 제거
- 입력이나 설정이 바뀌면 이전 수동 복사·다운로드 결과를 즉시 무효화

## 검증

- KOR / ENG, 빈 입력·오류 입력·정상 입력, 공개 iframe 높이, 데스크톱·375×812 가로 넘침을 확인한다.
- 이전 버전 폴더와 은퇴 호환 진입점은 수정하지 않는다.

