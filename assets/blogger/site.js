(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('theme.css', script.src).toString();
  document.head.appendChild(stylesheet);
  var siteUrl = new URL('../../outputs/site.json', script.src);
  var toolsUrl = new URL('../../outputs/tools.json', script.src);
  var homeMount = document.getElementById('ow-site-app');
  var postMount = document.getElementById('ow-post-nav');
  if (homeMount) document.documentElement.classList.add('ow-is-home');
  if (postMount) document.documentElement.classList.add('ow-is-post');

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
    });
  }

  function loadJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    });
  }

  function renderPostNavigation(config) {
    if (!postMount) return;
    var homeUrl = postMount.getAttribute('data-home-url') || '/';
    postMount.innerHTML = '<a class="ow-back-link" href="' + escapeHtml(homeUrl) + '#ow-tool-search">' + escapeHtml(config.labels.backToSearch) + '</a>';
  }

  function renderHome(config, toolsDocument) {
    if (!homeMount) return;
    var labels = config.labels;
    var tools = Array.isArray(toolsDocument.tools) ? toolsDocument.tools.slice() : [];
    tools.sort(function (a, b) { return Number(a.index) - Number(b.index); });
    homeMount.innerHTML =
      '<section class="ow-intro">' +
        '<p class="ow-eyebrow">' + escapeHtml(config.intro.eyebrow) + '</p>' +
        '<h1>' + escapeHtml(config.intro.title) + '</h1>' +
        '<p class="ow-intro-description">' + escapeHtml(config.intro.description) + '</p>' +
      '</section>' +
      '<section class="ow-catalog" aria-labelledby="ow-catalog-title">' +
        '<div class="ow-catalog-head"><h2 id="ow-catalog-title">' + escapeHtml(labels.catalogTitle) + '</h2><p class="ow-count" id="ow-tool-count"></p></div>' +
        '<form class="ow-tool-search" id="ow-tool-search"><input aria-label="' + escapeHtml(labels.searchLabel) + '" autocomplete="off" id="ow-query" placeholder="' + escapeHtml(labels.searchPlaceholder) + '" type="search"><button type="submit">' + escapeHtml(labels.searchButton) + '</button></form>' +
        '<div class="ow-tool-grid" id="ow-tool-grid" aria-live="polite"></div>' +
      '</section>';

    var grid = document.getElementById('ow-tool-grid');
    var count = document.getElementById('ow-tool-count');
    var query = document.getElementById('ow-query');
    var form = document.getElementById('ow-tool-search');

    function render(term) {
      var normalized = String(term || '').trim().toLocaleLowerCase('ko');
      var visible = tools.filter(function (tool) {
        return !normalized || (tool.title + ' ' + tool.tool + ' ' + (tool.description || '')).toLocaleLowerCase('ko').indexOf(normalized) !== -1;
      });
      count.textContent = visible.length + labels.countSuffix;
      if (!visible.length) {
        grid.innerHTML = '<div class="ow-empty">' + escapeHtml(labels.empty) + '</div>';
        return;
      }
      grid.innerHTML = visible.map(function (tool) {
        var available = typeof tool.postUrl === 'string' && tool.postUrl.length > 0;
        var tag = available ? 'a' : 'article';
        var link = available ? ' href="' + escapeHtml(tool.postUrl) + '"' : ' aria-disabled="true"';
        var action = available ? labels.openPost : labels.pendingPost;
        return '<' + tag + ' class="ow-tool-card"' + link + '>' +
          '<span class="ow-tool-index">' + String(tool.index).padStart(2, '0') + '</span>' +
          '<h3>' + escapeHtml(tool.title) + '</h3>' +
          '<p class="ow-tool-description">' + escapeHtml(tool.description || '') + '</p>' +
          '<p class="ow-tool-meta">' + escapeHtml(action) + ' · ' + escapeHtml(tool.version) + '</p>' +
          '</' + tag + '>';
      }).join('');
    }

    form.addEventListener('submit', function (event) { event.preventDefault(); render(query.value); });
    query.addEventListener('input', function () { render(query.value); });
    render('');
    if (window.location.hash === '#ow-tool-search') {
      window.requestAnimationFrame(function () {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        query.focus({ preventScroll: true });
      });
    }
  }

  loadJson(siteUrl).then(function (config) {
    renderPostNavigation(config);
    if (!homeMount) return null;
    return loadJson(toolsUrl).then(function (tools) { renderHome(config, tools); });
  }).catch(function () {
    if (homeMount) homeMount.remove();
    if (postMount) postMount.remove();
  });
}());
