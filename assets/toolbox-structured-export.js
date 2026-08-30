(function () {
  'use strict';

  const script = document.currentScript;
  const root = document.querySelector(script?.dataset.root || '.simple-tool');
  if (!script || !root || root.querySelector('[data-structured-export]')) return;

  const tr = (ko, en) => (document.documentElement.lang === 'en' ? en : ko);
  const output = root.querySelector(script.dataset.output || '#sg-output');
  const result = root.querySelector(script.dataset.result || '#sg-result');
  const status = root.querySelector(script.dataset.status || '#sg-status');
  const fallback = root.querySelector(script.dataset.fallback || '#sg-fallback');
  const filename = script.dataset.filename || 'toolbox-result.json';
  const tool = script.dataset.tool || location.pathname.split('/').filter(Boolean).at(-1) || 'toolbox';

  function setStatus(ko, en, error = false) {
    if (!status) return;
    status.textContent = tr(ko, en);
    status.className = `st-status ${error ? 'is-error' : 'is-good'}`;
  }

  function payload() {
    if (!output || !result || result.hidden) return null;
    const entries = [...output.querySelectorAll('.sg-result-row')].map((row) => ({
      label: row.querySelector('dt')?.textContent.trim() || '',
      value: row.querySelector('dd')?.textContent.trim() || ''
    })).filter((entry) => entry.label || entry.value);
    if (!entries.length) return null;
    const mode = root.querySelector('input[name="mode"]:checked, #mode')?.value || null;
    return { tool, mode, results: entries };
  }

  function json() {
    const value = payload();
    if (!value) {
      setStatus('먼저 결과를 만들어 주세요.', 'Create a result first.', true);
      return null;
    }
    return JSON.stringify(value, null, 2);
  }

  async function copyJson() {
    const value = json();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      if (fallback) fallback.hidden = true;
      setStatus('구조화된 JSON 결과를 복사했습니다.', 'Copied the structured JSON result.');
    } catch {
      if (fallback) {
        fallback.value = value;
        fallback.hidden = false;
      }
      setStatus('직접 복사할 JSON을 표시했습니다.', 'JSON is shown for manual copying.', true);
    }
  }

  function saveJson() {
    const value = json();
    if (!value) return;
    const url = URL.createObjectURL(new Blob([value], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setStatus(`${filename} 파일을 저장했습니다.`, `Saved ${filename}.`);
  }

  const actions = document.createElement('div');
  actions.className = 'st-actions';
  actions.dataset.structuredExport = '';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'st-secondary';
  copy.dataset.ko = 'JSON 복사';
  copy.dataset.en = 'Copy JSON';
  copy.setAttribute('aria-keyshortcuts', 'Alt+J');
  copy.textContent = tr(copy.dataset.ko, copy.dataset.en);
  copy.addEventListener('click', copyJson);
  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'st-secondary';
  save.dataset.ko = 'JSON 저장';
  save.dataset.en = 'Save JSON';
  save.setAttribute('aria-keyshortcuts', 'Alt+D');
  save.textContent = tr(save.dataset.ko, save.dataset.en);
  save.addEventListener('click', saveJson);
  actions.append(copy, save);
  (status || result || root.lastElementChild).before(actions);

  addEventListener('keydown', (event) => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
    if (event.key.toLowerCase() === 'j') { event.preventDefault(); copy.click(); }
    if (event.key.toLowerCase() === 'd') { event.preventDefault(); save.click(); }
  });
  addEventListener('toolbox-language-change', () => {
    copy.textContent = tr(copy.dataset.ko, copy.dataset.en);
    save.textContent = tr(save.dataset.ko, save.dataset.en);
  });
}());
