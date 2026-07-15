(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;
  var themeRelease = '2026-07-15.1';
  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('theme.css?v=' + themeRelease, script.src).toString();
  document.head.appendChild(stylesheet);
  var siteUrl = new URL('../../outputs/site.json', script.src);
  var toolsUrl = new URL('../../outputs/tools.json', script.src);
  var homeMount = document.getElementById('ow-site-app');
  var postMount = document.getElementById('ow-post-nav');
  var isInnerPage = !homeMount;
  if (homeMount) document.documentElement.classList.add('ow-is-home');
  if (postMount) document.documentElement.classList.add('ow-is-post');
  if (isInnerPage) document.documentElement.classList.add('ow-is-inner');

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
    postMount.innerHTML = '<a class="ow-back-link" href="' + escapeHtml(homeUrl) + '#ow-tool-search" aria-label="' + escapeHtml(config.labels.backToSearch) + '">' + escapeHtml(config.labels.backToSearch) + '</a>';
  }

  function createInnerDiscoveryMount() {
    if (!isInnerPage) return null;
    var existing = document.getElementById('ow-inner-discovery');
    if (existing) return existing;
    var anchor = document.querySelector('.date-header') || document.querySelector('.post') || document.querySelector('.main-inner > *');
    if (!anchor || !anchor.parentNode) return null;
    var mount = document.createElement('div');
    mount.id = 'ow-inner-discovery';
    mount.className = 'ow-site-app ow-post-discovery';
    anchor.parentNode.insertBefore(mount, anchor);
    return mount;
  }

  function normalizeSearch(value) {
    return String(value || '').normalize('NFKC').toLocaleLowerCase('ko').replace(/[^\p{L}\p{N}]+/gu, '');
  }

  function editDistance(left, right) {
    var previous = Array.from({ length: right.length + 1 }, function (_, index) { return index; });
    for (var i = 1; i <= left.length; i += 1) {
      var current = [i];
      for (var j = 1; j <= right.length; j += 1) current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1));
      previous = current;
    }
    return previous[right.length];
  }

  function matchesTool(tool, query) {
    var terms = [tool.title, tool.tool, tool.description].concat(Array.isArray(tool.keywords) ? tool.keywords : []).map(normalizeSearch).filter(Boolean);
    if (terms.some(function (term) { return term.includes(query) || query.includes(term); })) return true;
    if (query.length < 3) return false;
    var allowance = query.length >= 7 ? 2 : 1;
    return terms.some(function (term) { return Math.abs(term.length - query.length) <= allowance && editDistance(term, query) <= allowance; });
  }

  function renderDiscovery(mount, config, toolsDocument) {
    if (!mount) return;
    var isHomeDiscovery = mount === homeMount;
    var labels = config.labels;
    var tools = Array.isArray(toolsDocument.tools) ? toolsDocument.tools.slice() : [];
    tools.sort(function (a, b) { return Number(a.index) - Number(b.index); });
    mount.innerHTML =
      '<section class="ow-intro">' +
        '<p class="ow-eyebrow">' + escapeHtml(config.intro.eyebrow) + '</p>' +
        '<h1>' + escapeHtml(config.intro.title) + '</h1>' +
        '<p class="ow-intro-description">' + escapeHtml(config.intro.description) + '</p>' +
      '</section>' +
      '<section class="ow-catalog" aria-labelledby="ow-catalog-title">' +
        '<div class="ow-catalog-head"><h2 id="ow-catalog-title">' + escapeHtml(labels.catalogTitle) + '</h2><p class="ow-count" id="ow-tool-count"></p></div>' +
        '<form class="ow-tool-search" id="ow-tool-search"><input aria-label="' + escapeHtml(labels.searchLabel) + '" autocomplete="off" id="ow-query" placeholder="' + escapeHtml(labels.searchPlaceholder) + '" type="search"><button type="submit">' + escapeHtml(labels.searchButton) + '</button></form>' +
        '<div class="ow-tool-results' + (isHomeDiscovery ? ' ow-tool-grid' : '') + '" id="ow-tool-results" aria-live="polite"' + (isHomeDiscovery ? '' : ' hidden') + '></div>' +
      '</section>';

    var results = mount.querySelector('#ow-tool-results');
    var count = mount.querySelector('#ow-tool-count');
    var query = mount.querySelector('#ow-query');
    var form = mount.querySelector('#ow-tool-search');

    function render(term) {
      var normalized = normalizeSearch(term);
      if (!normalized) {
        if (isHomeDiscovery) {
          count.textContent = tools.length + labels.countSuffix;
          results.hidden = false;
        } else {
          count.textContent = labels.searchHint;
          results.innerHTML = '';
          results.hidden = true;
          return;
        }
      }
      var visible = normalized ? tools.filter(function (tool) { return matchesTool(tool, normalized); }) : tools;
      count.textContent = visible.length + labels.countSuffix;
      results.hidden = false;
      if (!visible.length) {
        results.innerHTML = '<div class="ow-empty">' + escapeHtml(labels.empty) + '</div>';
        return;
      }
      results.innerHTML = visible.map(function (tool) {
        var available = typeof tool.postUrl === 'string' && tool.postUrl.length > 0;
        var tag = available ? 'a' : 'article';
        var link = available ? ' href="' + escapeHtml(tool.postUrl) + '"' : ' aria-disabled="true"';
        var action = available ? labels.openPost : labels.pendingPost;
        if (isHomeDiscovery) return '<' + tag + ' class="ow-tool-card"' + link + '>' +
          '<span class="ow-tool-index">' + String(tool.index).padStart(2, '0') + '</span>' +
          '<h3>' + escapeHtml(tool.title) + '</h3>' +
          '<p class="ow-tool-description">' + escapeHtml(tool.description || '') + '</p>' +
          '<p class="ow-tool-meta">' + escapeHtml(action) + ' · ' + escapeHtml(tool.version) + '</p>' +
          '</' + tag + '>';
        return '<' + tag + ' class="ow-tool-result"' + link + '>' +
          '<span class="ow-tool-result-copy"><strong>' + escapeHtml(tool.title) + '</strong><small>' + escapeHtml(tool.description || '') + '</small></span>' +
          '<span class="ow-tool-result-action">' + escapeHtml(action) + ' · ' + escapeHtml(tool.version) + '</span>' +
          '</' + tag + '>';
      }).join('');
    }

    form.addEventListener('submit', function (event) { event.preventDefault(); render(query.value); });
    query.addEventListener('input', function () { render(query.value); });
    render('');
    if (window.location.hash === '#ow-tool-search') {
      window.requestAnimationFrame(function () {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (!window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) query.focus({ preventScroll: true });
      });
    }
  }

  loadJson(siteUrl).then(function (config) {
    renderPostNavigation(config);
    if (!homeMount && !isInnerPage) return null;
    return loadJson(toolsUrl).then(function (tools) {
      if (homeMount) renderDiscovery(homeMount, config, tools);
      if (isInnerPage) renderDiscovery(createInnerDiscoveryMount(), config, tools);
    });
  }).catch(function () {
    if (homeMount) homeMount.remove();
    if (postMount) postMount.remove();
    document.getElementById('ow-inner-discovery')?.remove();
  });
}());
