# Toolbox · Blogger 인라인 도구 기본 템플릿

> 이 문서는 `blogger` 프로젝트 안의 `toolbox` 하위 프로젝트가 새 도구를 만들 때 사용하는 기준 템플릿이다.
> 첫 기준 구현은 `QR · 바코드 생성기`이며, 최종 HTML은 `outputs/qr-barcode-generator/0.0.1v/first-post-qr-barcode-generator.html`에서 확인한다.

## 목표

독자가 Blogger 게시글을 열자마자 별도 사이트 이동·로그인·설치 없이 도구를 사용할 수 있게 한다. 도구 하나는 하나의 문제만 간편하게 해결한다.

## 반드시 포함할 내용

1. 도구 제목
2. 한두 문장의 설명
3. 핵심 기능 목록
4. 실제 실행 영역
5. 짧은 사용 방법
6. FAQ 2~3개

## 기본 인터페이스 규칙

- 흰 배경과 밝은 스카이블루 톤을 사용한다.
- 강조 버튼은 `--toolbox-sky` 배경과 흰 글자를 사용한다.
- 버튼 모서리는 `0.5rem`을 사용한다.
- 취소·되돌리기가 필요할 때만 흰 배경·검정 글자 버튼을 추가한다.
- 실행 결과가 입력값만으로 안전하게 계산되면 별도 생성 버튼 없이 입력 변경 즉시 갱신한다.
- 연속 수치는 가로 슬라이더와 현재 값으로 제어한다.
- 선택지는 4개 이하일 때 라디오 버튼, 5개 이상일 때 콤보박스를 사용한다.
- 파일 도구는 파일 선택과 드래그 앤 드롭을 함께 제공한다.
- 모바일과 PC에서 동일한 핵심 기능을 제공한다.

## 기본 색상 토큰

아래 값은 `toolbox/styles/base.css`와 동일하다. Blogger에 붙여 넣는 최종 HTML에는 도구 전용 범위 안에 같은 값을 선언한다.

```css
--toolbox-sky: #0879b2;
--toolbox-sky-hover: #066d9f;
--toolbox-sky-pale: #eefaff;
--toolbox-ink: #16232c;
--toolbox-muted: #5d707b;
--toolbox-line: #d8e9f1;
--toolbox-radius: .5rem;
```

## Blogger 게시글 HTML 뼈대

`{{tool-id}}`, `{{title}}`, `{{description}}` 등 중괄호 항목을 새 도구 내용으로 바꾼다. 전체 코드는 Blogger 글쓰기 화면의 **HTML 보기**에 붙여 넣는다.

```html
<article id="toolbox-{{tool-id}}" class="toolbox-post">
  <style>
    #toolbox-{{tool-id}} {
      --tb-sky: #0879b2;
      --tb-sky-hover: #066d9f;
      --tb-pale: #eefaff;
      --tb-ink: #16232c;
      --tb-muted: #5d707b;
      --tb-line: #d8e9f1;
      max-width: 760px;
      margin: 0 auto;
      color: var(--tb-ink);
      font-family: Arial, "Noto Sans KR", sans-serif;
      line-height: 1.7;
    }
    #toolbox-{{tool-id}} .tb-box {
      margin: 24px 0;
      padding: 20px 22px;
      border: 1px solid var(--tb-line);
      border-radius: 12px;
      background: var(--tb-pale);
    }
    #toolbox-{{tool-id}} .tb-primary {
      min-height: 44px;
      padding: 0 18px;
      color: #fff;
      background: var(--tb-sky);
      border: 1px solid var(--tb-sky);
      border-radius: .5rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    #toolbox-{{tool-id}} .tb-primary:hover { background: var(--tb-sky-hover); }
    #toolbox-{{tool-id}} .tb-secondary {
      min-height: 44px;
      padding: 0 18px;
      color: #111;
      background: #fff;
      border: 1px solid #b9c7cd;
      border-radius: .5rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    @media (max-width: 600px) {
      #toolbox-{{tool-id}} { padding: 0 4px; }
      #toolbox-{{tool-id}} .tb-primary,
      #toolbox-{{tool-id}} .tb-secondary { width: 100%; }
    }
  </style>

  <h1>{{title}}</h1>
  <p class="tb-lead">{{description}}</p>

  <div class="tb-box">
    <strong>이 도구로 할 수 있는 일</strong>
    <ul>
      <li>{{feature-1}}</li>
      <li>{{feature-2}}</li>
      <li>{{feature-3}}</li>
    </ul>
  </div>

  <h2>{{title}} 사용하기</h2>
  <div class="tb-tool">
    <!-- 입력 요소와 결과 영역을 넣습니다. -->
  </div>

  <h2>사용 방법</h2>
  <ol>
    <li>{{step-1}}</li>
    <li>{{step-2}}</li>
    <li>{{step-3}}</li>
  </ol>

  <h2>자주 묻는 질문</h2>
  <details><summary>{{faq-question-1}}</summary><p>{{faq-answer-1}}</p></details>
  <details><summary>{{faq-question-2}}</summary><p>{{faq-answer-2}}</p></details>

  <script>
    (function () {
      const root = document.getElementById('toolbox-{{tool-id}}');
      // root.querySelector(...)로만 요소를 찾아 다른 게시글과 충돌하지 않게 합니다.
      // 입력 변화 이벤트에서 결과를 갱신합니다.
    }());
  </script>
</article>
```

## JavaScript 규칙

- 모든 코드는 즉시 실행 함수로 감싸고, `document.getElementById('toolbox-{{tool-id}}')` 아래에서만 요소를 찾는다.
- 입력값이 바뀔 때 `input` 또는 `change` 이벤트로 결과를 자동 갱신한다.
- 오류는 도구 영역 안에서 짧고 이해하기 쉬운 문장으로 표시한다.
- 입력값과 결과는 기본적으로 서버에 저장하지 않는다.
- 외부 라이브러리가 필요하면 HTTPS CDN 주소를 쓰고, 그 이유와 라이브러리 이름을 도구 정의 Markdown에 기록한다.

## 새 도구 생성 절차

1. `toolbox/tools/{{tool-id}}.md`에 제목, 설명, 입력값, 기능과 실행 규칙을 정의한다.
2. 이 템플릿을 바탕으로 Blogger 게시글 HTML을 만든다.
3. HTML 전체를 `outputs/{{tool-id}}/{{version}}/{{tool-id}}.html`에 저장한다.
4. 같은 버전 폴더에 `patch-notes.json`을 작성한다.
5. `outputs/{{tool-id}}/versions.json`에 새 버전 정보와 경로를 추가한다.
4. 모바일·PC에서 입력, 자동 갱신, 저장 또는 복사 기능을 확인한다.
5. Blogger의 HTML 보기에 붙여 넣고 미리보기한 뒤 발행한다.
