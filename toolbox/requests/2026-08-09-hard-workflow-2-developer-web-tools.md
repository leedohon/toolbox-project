# 2026-08-09 하드 워크플로 2회차

## 정규화

- 작업 종류: hard
- 대상 도구: regex-tester, hash-generator, xml-formatter-validator, url-parser-builder, jwt-decoder, web-meta-preview-builder
- 버전 단계: 사용자 기능 추가 대상은 minor
- Blogger 게시: 기존 공개 글 6개 갱신
- Git·배포: 1회차와 분리된 독립 커밋, main 푸시, GitHub Pages 확인
- 종료 예약: 요청 없음

## 사용자 노출 개선 6건

1. 정규식 일치 목록에 번호·이름 있는 캡처 그룹 표시
2. SHA-256·384·512 해시를 한 번에 계산하는 선택지
3. XML 루트 요소·전체 속성 수 요약
4. URL에 UTM 기본 3종을 빠르게 추가
5. JWT 헤더 JSON 별도 복사
6. 공유 이미지 대체 설명과 og:image:alt·twitter:image:alt 생성

## 통합 기능 3건

- 캡처 그룹 확인을 기존 정규식 결과에 통합
- 세 해시 동시 계산을 기존 알고리즘 선택에 통합
- UTM 기본 항목 추가를 기존 URL 쿼리 편집기에 통합

## 공통 수정 2건

- 입력·설정 변경 시 이전 수동 복사 결과를 즉시 숨김
- 여섯 도구의 접근성 도구명을 KOR / ENG 선택과 함께 전환

## 검증

- 빈 입력·오류 입력·정상 입력, KOR / ENG, 375×812와 1280×900, Blogger iframe 높이를 확인한다.
- 이전 버전 폴더는 수정하지 않는다.
