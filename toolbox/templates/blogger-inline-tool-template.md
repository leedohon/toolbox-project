# Toolbox · Blogger iframe 도구 기본 템플릿

## 파일 역할

- `toolbox/posts/{{tool-id}}.html`: Blogger HTML 보기에 복사할 최신 게시글 원본
- `outputs/{{tool-id}}/{{version}}/{{tool-id}}.html`: 변경하지 않고 보존하는 버전별 게시글 HTML
- `embed/{{tool-id}}/index.html`: GitHub Pages에서 제공하며 기능 업데이트 때 갱신하는 최신 실행 HTML

게시글에는 설명과 사용 방법, FAQ를 포함하고 실제 기능 영역은 아래 고정 주소의 iframe으로 불러온다.

```text
https://leedohon.github.io/toolbox-project/embed/{{tool-id}}/
```

## 게시글 HTML 뼈대

```html
<!-- Blogger 글쓰기 화면의 HTML 보기에 전체를 붙여 넣으세요. -->
<article id="toolbox-{{tool-id}}-post" style="max-width:860px;margin:0 auto;color:#16232c;font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7">
  <h1>{{title}}</h1>
  <p>{{description}}</p>

  <div style="margin:24px 0;padding:20px 22px;border:1px solid #d8e9f1;border-radius:12px;background:#eefaff">
    <strong>이 도구로 할 수 있는 일</strong>
    <ul>
      <li>{{feature-1}}</li>
      <li>{{feature-2}}</li>
      <li>{{feature-3}}</li>
    </ul>
  </div>

  <h2>{{title}} 사용하기</h2>
  <iframe
    src="https://leedohon.github.io/toolbox-project/embed/{{tool-id}}/"
    title="{{title}}"
    id="toolbox-{{tool-id}}-frame"
    width="100%"
    height="{{iframe-fallback-height}}"
    loading="lazy"
    scrolling="no"
    style="display:block;width:100%;border:0;border-radius:12px;background:#fff;overflow:hidden"
    referrerpolicy="strict-origin-when-cross-origin"></iframe>
  <p>도구가 보이지 않으면 <a href="https://leedohon.github.io/toolbox-project/embed/{{tool-id}}/" target="_blank" rel="noopener">새 창에서 열기</a>를 이용하세요.</p>

  <h2>사용 방법</h2>
  <ol><li>{{step-1}}</li><li>{{step-2}}</li><li>{{step-3}}</li></ol>

  <h2>자주 묻는 질문</h2>
  <details><summary>{{question-1}}</summary><p>{{answer-1}}</p></details>
  <details><summary>업데이트 때 게시글을 다시 수정해야 하나요?</summary><p>아니요. 고정된 iframe 주소에서 최신 기능을 불러옵니다.</p></details>
</article>
<script>
  (function () {
    var frame = document.getElementById('toolbox-{{tool-id}}-frame');
    window.addEventListener('message', function (event) {
      if (event.origin !== 'https://leedohon.github.io' || !event.data || event.data.source !== 'toolbox-embed' || event.data.tool !== '{{tool-id}}') return;
      var height = Number(event.data.height);
      if (Number.isFinite(height) && height >= 320 && height <= 3000) frame.style.height = Math.ceil(height) + 'px';
    });
  }());
</script>
```

## 운영 절차

1. 새 기능은 `embed/{{tool-id}}/index.html`에서 구현하고 모바일과 PC를 확인한다.
2. 게시글 설명도 변경되면 다음 버전의 `outputs/` 폴더를 만들고 `toolbox/posts/{{tool-id}}.html`을 같은 내용으로 갱신한다.
3. 게시글 iframe의 `src`는 버전과 관계없이 고정 주소를 유지한다.
4. `patch-notes.json`과 `versions.json`을 함께 갱신한다.
5. GitHub Pages의 배포 원본은 `main` 브랜치 루트로 설정한다.
6. 기능 HTML은 `ResizeObserver`로 실제 높이를 감지하고 `{ source: 'toolbox-embed', tool: '{{tool-id}}', height }` 메시지를 부모로 전송한다.
