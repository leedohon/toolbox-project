# 전 도구 KOR/ENG 전환과 바코드 텍스트 표시 설정

## 사용자 요청

- 현재 공개된 모든 도구에 `KOR / ENG` 언어 전환 기능을 추가한다.
- 언어 기능은 앞으로 추가되는 모든 도구가 공통으로 재사용한다.
- QR · 바코드 생성기에서 Code 128 바코드 하단 텍스트를 표시하거나 숨길 수 있게 한다.
- 구현, 검증, Blogger 반영, 커밋, 푸시, 공개 배포 확인까지 완료한다.

## 확정 구현

- 모든 iframe 도구 상단에 같은 형태의 `KOR / ENG` 분할 선택기를 둔다.
- 기본 언어는 한국어이며 사용자가 고른 언어를 브라우저 저장소에 보관한다. 같은 GitHub Pages 출처의 다른 도구를 열어도 선택이 이어진다.
- 정적 라벨뿐 아니라 버튼, 플레이스홀더, 힌트, 오류, 완료 상태, 결과, 새로 추가되는 목록 행과 접근성 문구도 전환한다.
- 공통 언어 선택 UI, 저장 및 번역 적용 로직은 `assets/toolbox-i18n.css`와 `assets/toolbox-i18n.js`를 단일 원본으로 사용한다. 각 도구는 도구별 번역 사전만 제공한다.
- 바코드 텍스트 표시는 체크박스로 제공하고 기본값은 표시다. QR 모드에서는 관련 설정을 숨긴다.
- 이번 변경은 사용자에게 보이는 공통 기능 추가이므로 모든 공개 도구를 `minor` 등급으로 새 버전 배포한다.

## 대상과 다음 버전

- QR · 바코드 생성기: `0.4.0v`
- JSON 도구: `0.5.0v`
- Base64 도구: `0.5.0v`
- 사다리게임: `0.2.0v`
- 돌림판: `0.2.0v`
- 숫자뽑기: `0.1.0v`
- 편가르기: `0.2.0v`
- 이미지 모자이크 도구: `0.1.0v`

## 검증 및 배포 명령

```text
node scripts/build-tool-catalog.mjs
node scripts/validate-tool-releases.mjs
node scripts/blogger-update-tool-posts.mjs qr-barcode-generator json-tools base64-tools ladder-game wheel-spinner number-picker team-divider image-mosaic-tool
git status --short
git add <이번 작업 파일>
git commit -m "feat(toolbox): add shared KOR ENG mode to all tools"
git push origin main
```

## 완료 기준

- 8개 도구에서 KOR/ENG 전환이 즉시 적용되고 새로고침 및 도구 이동 뒤에도 유지된다.
- 동적 입력 행, 오류와 결과 문구에 번역 누락이 없다.
- 바코드 하단 텍스트를 끄면 생성 결과와 PNG·SVG 저장 결과에서 모두 사라진다.
- 데스크톱과 모바일에서 선택기가 잘리거나 가로 넘침을 만들지 않는다.
- 각 새 버전의 `patch-notes.json`에 기능 변경과 디자인 점검 결과를 기록한다.
