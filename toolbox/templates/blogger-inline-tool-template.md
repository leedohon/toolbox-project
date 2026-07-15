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

공통 외형은 `assets/blogger/theme.css`의 `.tb-post` 규칙이 담당한다. 게시글마다 `<style>` 블록이나 공통 인라인 스타일을 복제하지 않는다.

```html
<!-- Blogger 글쓰기 화면의 HTML 보기에 전체를 붙여 넣으세요. -->
<article id="toolbox-{{tool-id}}-post" class="tb-post">
  <header class="tb-hero">
    <p class="tb-label">초간단 툴박스</p>
    <h1>{{title}}</h1>
    <p class="tb-lead">{{description}}</p>
    <ul class="tb-features">
      <li>{{feature-1}}</li>
      <li>{{feature-2}}</li>
      <li>{{feature-3}}</li>
    </ul>
  </header>

  <h2>{{title}} 사용하기</h2>
  <div class="tb-frame"><iframe src="https://leedohon.github.io/toolbox-project/embed/{{tool-id}}/" title="{{title}}" id="toolbox-{{tool-id}}-frame" height="{{iframe-fallback-height}}" loading="lazy" scrolling="no" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
  <p class="tb-fallback">도구가 보이지 않으면 <a href="https://leedohon.github.io/toolbox-project/embed/{{tool-id}}/" target="_blank" rel="noopener">새 창에서 열기</a>를 이용하세요.</p>

  <h2>사용 방법</h2>
  <ol class="tb-steps"><li>{{step-1}}</li><li>{{step-2}}</li><li>{{step-3}}</li></ol>

  <!-- tb-tool-details:start --><section class="tb-tool-details">{{generated-tool-details}}</section><!-- tb-tool-details:end -->
  <!-- tb-tags:start --><nav class="tb-tags" aria-label="관련 태그">{{generated-tool-tags}}</nav><!-- tb-tags:end -->
  <!-- tb-faq:start --><h2>자주 묻는 질문</h2>{{generated-user-faq}}{{generated-user-faq}}{{generated-user-faq}}{{generated-user-faq}}<!-- tb-faq:end -->
  <!-- tb-patch-notes:start --><details class="tb-patch-notes"><summary>패치노트</summary><div class="tb-patch-list">{{generated-cumulative-patch-notes}}</div></details><!-- tb-patch-notes:end -->
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
5. `toolbox/post-content.json`에 상세 설명과 FAQ를 작성하고 `node scripts/build-tool-posts.mjs {{tool-id}}`를 실행해 공통 게시글 영역을 생성한다.
6. GitHub Pages의 배포 원본은 `main` 브랜치 루트로 설정한다.
7. 기능 HTML은 `ResizeObserver`로 실제 높이를 감지하고 `{ source: 'toolbox-embed', tool: '{{tool-id}}', height }` 메시지를 부모로 전송한다.
8. 게시 또는 릴리스 요청이면 최신 버전 HTML을 Blogger 초안 또는 공개 글로 생성하고 반환된 URL을 확인한다.
9. `node scripts/blogger-sync-post-urls.mjs`로 `versions.json`과 `outputs/tools.json`의 `postUrl`을 맞춘다.
10. 비밀값과 관련 없는 파일을 제외한 뒤 권한이 허용되면 에이전트가 직접 커밋하고 `main`에 푸시한다.
11. GitHub Actions와 GitHub Pages 배포, 공개 게시글의 iframe 동작을 확인한다.

상세한 게시 상태 판단, OAuth 보안, 실패 처리 기준은 [`toolbox/BLOGGER-OPERATIONS.md`](../BLOGGER-OPERATIONS.md)를 따른다.
