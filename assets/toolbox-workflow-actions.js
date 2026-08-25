(function () {
  'use strict';

  const script = document.currentScript;
  const root = document.querySelector('.simple-tool, .play-tool, .mosaic-tool');
  if (!script || !root || root.querySelector('[data-workflow-actions]')) return;

  const tr = (ko, en) => (document.documentElement.lang === 'en' ? en : ko);
  const primary = document.querySelector(script.dataset.primary || '.st-primary');
  const controls = [...root.querySelectorAll('input:not([type="file"]), textarea:not([readonly]), select')];
  const initial = controls.map((control) => ({ control, value: control.value, checked: control.checked }));
  const actions = document.createElement('div');
  actions.className = 'st-actions';
  actions.dataset.workflowActions = '';

  function emit(control) {
    control.dispatchEvent(new Event(control.type === 'checkbox' || control.type === 'radio' || control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  }

  function makeButton(ko, en, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'st-secondary';
    button.dataset.ko = ko;
    button.dataset.en = en;
    button.textContent = tr(ko, en);
    button.addEventListener('click', action);
    actions.append(button);
    return button;
  }

  const hasReset = root.querySelector('[id$="-reset"], [data-reset-action]');
  if (!hasReset && script.dataset.reset !== 'false') {
    makeButton('입력 초기화', 'Reset inputs', () => {
      initial.forEach(({ control, value, checked }) => {
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = checked;
        else control.value = value;
        emit(control);
      });
      root.querySelectorAll('input[type="file"]').forEach((input) => { input.value = ''; });
      window.ToolboxUX?.focus(controls[0]);
    });
  }

  const importTargets = (script.dataset.fileTargets || '').split(';').map((entry) => entry.trim()).filter(Boolean);
  importTargets.forEach((entry) => {
    const [selector, koLabel, enLabel] = entry.split('|');
    const target = document.querySelector(selector);
    if (!target) return;
    makeButton(`${koLabel} 파일 불러오기`, `Import ${enLabel} file`, () => {
      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = '.txt,.md,.csv,.tsv,.json,.xml,.html,.log,text/plain,text/markdown';
      picker.addEventListener('change', async () => {
        const file = picker.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
          alert(tr('1MB 이하의 텍스트 파일을 선택해 주세요.', 'Choose a text file no larger than 1 MB.'));
          return;
        }
        target.value = await file.text();
        emit(target);
        window.ToolboxUX?.focus(target);
      }, { once: true });
      picker.click();
    });
  });

  const saveTargets = (script.dataset.saveTargets || '').split(';').map((entry) => entry.trim()).filter(Boolean);
  saveTargets.forEach((entry) => {
    const [selector, koLabel, enLabel, filename = 'toolbox-input.txt'] = entry.split('|');
    const target = document.querySelector(selector);
    if (!target) return;
    makeButton(`${koLabel} 저장`, `Save ${enLabel}`, () => {
      const blob = new Blob([target.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    });
  });

  if (actions.children.length) {
    const anchor = root.querySelector('.st-status, .st-result');
    if (anchor) anchor.before(actions);
    else root.append(actions);
  }

  if (primary) {
    primary.setAttribute('aria-keyshortcuts', 'Control+Enter Meta+Enter');
    const help = document.createElement('p');
    help.className = root.matches('.mosaic-tool') ? 'mosaic-status' : 'st-help';
    help.dataset.workflowShortcut = '';
    help.textContent = tr('Ctrl/⌘ + Enter로 주요 동작을 실행할 수 있습니다.', 'Press Ctrl/⌘ + Enter to run the primary action.');
    if (actions.isConnected) actions.after(help);
    else (primary.closest('.st-actions, .mosaic-actions') || primary).after(help);
    addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || (!event.ctrlKey && !event.metaKey) || event.isComposing) return;
      event.preventDefault();
      primary.click();
    });
  }

  addEventListener('toolbox-language-change', () => {
    actions.querySelectorAll('[data-ko][data-en]').forEach((element) => { element.textContent = tr(element.dataset.ko, element.dataset.en); });
    const help = root.querySelector('[data-workflow-shortcut]');
    if (help) help.textContent = tr('Ctrl/⌘ + Enter로 주요 동작을 실행할 수 있습니다.', 'Press Ctrl/⌘ + Enter to run the primary action.');
  });
}());
