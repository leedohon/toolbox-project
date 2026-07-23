import { setupEmbedHeight } from './play-tools.js?v=0.3.2';

const root = document.querySelector('[data-tool-hub]');
if (!root) throw new Error('Tool hub root is missing.');

const hubTool = root.dataset.tool;
const registryUrl = new URL(root.dataset.registry || './modules.json', location.href);
const control = root.querySelector('[data-tool-hub-control]');
const picker = root.querySelector('.tool-hub__picker');
const stage = root.querySelector('[data-tool-hub-stage]');
const status = root.querySelector('[data-tool-hub-status]');
const frames = new Map();
const modulesByTool = new Map();
const frameObservers = new WeakMap();
const storedModeKey = `${hubTool}-module`;
const childFlag = 'toolbox-hub-child';
const modulePattern = /^[a-z0-9-]+$/;
let modules = [];
let activeId = '';
let hubMeta = null;

const isEnglish = () => window.ToolboxI18n?.language === 'en';
const translated = (value) => isEnglish() ? value.en : value.ko;

function setStatus(ko, en, error = false) {
  status.textContent = isEnglish() ? en : ko;
  status.classList.toggle('is-error', error);
  if (error) status.setAttribute('role', 'alert');
  else status.removeAttribute('role');
}

function assertRegistry(documentData) {
  if (documentData?.schemaVersion !== 1 || documentData?.hub?.kind !== 'iframe') {
    throw new Error('지원하지 않는 도구 모듈 목록입니다.');
  }
  if (documentData.hub.tool !== hubTool || !modulePattern.test(hubTool || '')) {
    throw new Error('도구 모듈 식별자가 맞지 않습니다.');
  }
  if (!documentData.hub.title?.ko || !documentData.hub.title?.en) {
    throw new Error('도구 모듈 제목이 빠졌습니다.');
  }
  if (!Array.isArray(documentData.modules) || documentData.modules.length < 2) {
    throw new Error('사용할 도구 모듈이 부족합니다.');
  }

  const ids = new Set();
  const messageTools = new Set();
  let ownModuleCount = 0;
  for (const module of documentData.modules) {
    if (!modulePattern.test(module?.id || '') || ids.has(module.id)) {
      throw new Error('도구 모듈 식별자가 올바르지 않습니다.');
    }
    if (!modulePattern.test(module?.messageTool || '') || messageTools.has(module.messageTool)) {
      throw new Error('도구 높이 식별자가 올바르지 않습니다.');
    }
    if (!module.label?.ko || !module.label?.en || !module.entry) {
      throw new Error('도구 모듈 정보가 빠졌습니다.');
    }
    for (const capability of ['resultCode', 'png', 'copyFallback', 'i18n']) {
      if (typeof module.capabilities?.[capability] !== 'boolean') {
        throw new Error('도구 모듈 기능 정보가 올바르지 않습니다.');
      }
    }
    const entryUrl = new URL(module.entry, registryUrl);
    if (entryUrl.origin !== location.origin) {
      throw new Error('같은 사이트의 도구 모듈만 연결할 수 있습니다.');
    }
    if (module.messageTool === hubTool) ownModuleCount += 1;
    ids.add(module.id);
    messageTools.add(module.messageTool);
  }
  if (ownModuleCount !== 1) throw new Error('통합 도구의 기본 모듈을 확인해 주세요.');
}

function setLocalizedText(element, label) {
  element.dataset.ko = label.ko;
  element.dataset.en = label.en;
  element.textContent = translated(label);
}

function renderControls() {
  control.replaceChildren();
  if (modules.length >= 5) {
    const label = document.createElement('label');
    label.className = 'tool-hub__select-label';
    label.htmlFor = `${hubTool}-module-select`;
    setLocalizedText(label, { ko: '기능 선택', en: 'Choose a tool' });
    const select = document.createElement('select');
    select.className = 'tool-hub__select';
    select.id = label.htmlFor;
    for (const module of modules) {
      const option = document.createElement('option');
      option.value = module.id;
      setLocalizedText(option, module.label);
      select.append(option);
    }
    select.addEventListener('change', () => activate(select.value));
    control.append(label, select);
    return;
  }

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'tool-hub__fieldset';
  const legend = document.createElement('legend');
  legend.className = 'tool-hub__legend';
  setLocalizedText(legend, { ko: '기능 선택', en: 'Choose a tool' });
  const options = document.createElement('div');
  options.className = 'tool-hub__options';
  for (const module of modules) {
    const label = document.createElement('label');
    label.className = 'tool-hub__option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `${hubTool}-module`;
    input.value = module.id;
    input.addEventListener('change', () => {
      if (input.checked) activate(module.id);
    });
    const text = document.createElement('span');
    setLocalizedText(text, module.label);
    label.append(input, text);
    options.append(label);
  }
  fieldset.append(legend, options);
  control.append(fieldset);
}

function selectedModuleId() {
  const parameters = new URLSearchParams(location.search);
  const requested = parameters.get('module');
  if (modules.some((module) => module.id === requested)) return requested;

  const passthrough = [...parameters.keys()].some((key) => !['module', childFlag, 'release'].includes(key));
  if (passthrough) return modules.find((module) => module.messageTool === hubTool).id;

  const stored = localStorage.getItem(storedModeKey);
  return modules.some((module) => module.id === stored) ? stored : modules[0].id;
}

function childUrl(module, initialId) {
  const url = new URL(module.entry, registryUrl);
  url.searchParams.set(childFlag, '1');
  if (module.id === initialId) {
    const parameters = new URLSearchParams(location.search);
    for (const [key, value] of parameters) {
      if (!['module', childFlag, 'release'].includes(key)) url.searchParams.append(key, value);
    }
  }
  return url;
}

function forwardLanguage(frame) {
  try {
    frame.contentWindow?.ToolboxI18n?.setLanguage(isEnglish() ? 'en' : 'ko');
  } catch (_) {
    // Registry validation keeps current modules same-origin; tolerate a frame closing during navigation.
  }
}

function syncFrameHeight(frame) {
  try {
    const body = frame.contentDocument?.body;
    if (!body) return;
    const height = Math.min(5600, Math.max(320, Math.ceil(body.scrollHeight)));
    frame.style.height = `${height}px`;
  } catch (_) {
    // Registry validation keeps current modules same-origin; tolerate a frame closing during navigation.
  }
}

function observeFrameHeight(frame) {
  frameObservers.get(frame)?.disconnect();
  try {
    const body = frame.contentDocument?.body;
    if (!body) return;
    const observer = new ResizeObserver(() => syncFrameHeight(frame));
    observer.observe(body);
    frameObservers.set(frame, observer);
    syncFrameHeight(frame);
  } catch (_) {
    // A child can briefly be unavailable while its document is being replaced.
  }
}

function updateHubLanguage() {
  if (!hubMeta) return;
  const title = translated(hubMeta.title);
  document.title = title;
  picker?.setAttribute('aria-label', title);
}

function buildFrame(module, initialId) {
  const frame = document.createElement('iframe');
  frame.className = 'tool-hub__frame';
  frame.dataset.src = childUrl(module, initialId).toString();
  frame.title = `${module.label.ko} / ${module.label.en}`;
  frame.loading = module.id === initialId ? 'eager' : 'lazy';
  frame.scrolling = 'no';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'clipboard-write';
  frame.hidden = module.id !== initialId;
  frame.addEventListener('load', () => {
    forwardLanguage(frame);
    observeFrameHeight(frame);
  });
  frames.set(module.id, frame);
  modulesByTool.set(module.messageTool, module);
  if (module.id === initialId) frame.src = frame.dataset.src;
  stage.append(frame);
}

function activate(id, persist = true) {
  if (!frames.has(id)) return;
  activeId = id;
  for (const [moduleId, frame] of frames) {
    frame.hidden = moduleId !== id;
    if (moduleId === id && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
    if (moduleId === id) syncFrameHeight(frame);
  }

  const select = control.querySelector('select');
  if (select) select.value = id;
  const radio = control.querySelector(`input[value="${CSS.escape(id)}"]`);
  if (radio) radio.checked = true;

  const module = modules.find((item) => item.id === id);
  setStatus(
    `${module.label.ko} 기능을 열었습니다.`,
    `${module.label.en} is open.`,
  );
  if (persist) localStorage.setItem(storedModeKey, id);
}

addEventListener('message', (event) => {
  if (event.origin !== location.origin || event.data?.source !== 'toolbox-embed') return;
  const module = modulesByTool.get(String(event.data.tool || ''));
  const frame = module && frames.get(module.id);
  if (!frame || event.source !== frame.contentWindow) return;

  const height = Number(event.data.height);
  if (!Number.isFinite(height) || height < 320 || height > 5600) return;
  frame.style.height = `${Math.ceil(height)}px`;
});

addEventListener('toolbox-language-change', () => {
  updateHubLanguage();
  for (const frame of frames.values()) {
    forwardLanguage(frame);
    syncFrameHeight(frame);
  }
  const module = modules.find((item) => item.id === activeId);
  if (module) {
    setStatus(
      `${module.label.ko} 기능을 열었습니다.`,
      `${module.label.en} is open.`,
    );
  }
});

setupEmbedHeight(hubTool, { content: true, rootSelector: '.tool-hub' });

try {
  const response = await fetch(registryUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error('도구 모듈 목록을 불러오지 못했습니다.');
  const documentData = await response.json();
  assertRegistry(documentData);
  hubMeta = documentData.hub;
  updateHubLanguage();
  modules = documentData.modules;
  renderControls();
  const initialId = selectedModuleId();
  for (const module of modules) buildFrame(module, initialId);
  activate(initialId, false);
} catch (error) {
  setStatus(
    error.message || '도구를 준비하지 못했습니다.',
    'The tool could not be prepared.',
    true,
  );
}
