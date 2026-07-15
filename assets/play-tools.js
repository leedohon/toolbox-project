export function randomInt(max) {
  if (!Number.isInteger(max) || max < 1) throw new Error('잘못된 난수 범위입니다.');
  const limit = Math.floor(0x100000000 / max) * max;
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return values[0] % max;
}

export function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

const safeFocus = (element, options) => window.ToolboxUX?.focus(element, options) || false;

export function parseLines(value, { min = 2, max, maxLength = 40, label = '항목' }) {
  const lines = String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < min || lines.length > max) throw new Error(`${label}은 ${min}~${max}개 입력해 주세요.`);
  if (lines.some((line) => line.length > maxLength)) throw new Error(`${label}은 각각 ${maxLength}자 이하로 입력해 주세요.`);
  return lines;
}

function clearRowError(row) {
  row.classList.remove('is-empty');
  row.querySelectorAll('input').forEach((input) => input.removeAttribute('aria-invalid'));
  const hint = row.querySelector('.play-row-hint');
  if (hint) hint.hidden = true;
}

export function setupListEditor({ container, addButton, initialValues, label, placeholder, min = 2, max, maxLength = 40 }) {
  function rows() { return [...container.querySelectorAll('.play-list-row')]; }
  function sync() {
    const current = rows();
    current.forEach((row, index) => {
      row.querySelector('.play-row-index').textContent = index + 1;
      const input = row.querySelector('input');
      input.setAttribute('aria-label', `${label} ${index + 1}`);
      const remove = row.querySelector('.play-remove');
      remove.disabled = current.length <= min;
      remove.setAttribute('aria-label', `${label} ${index + 1} 삭제`);
    });
    addButton.disabled = current.length >= max;
  }
  function add(value = '', focus = true) {
    if (rows().length >= max) return;
    const row = document.createElement('div');
    row.className = 'play-list-row';
    const index = document.createElement('span');
    index.className = 'play-row-index';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = maxLength;
    input.placeholder = placeholder;
    input.value = value;
    if (value) input.dataset.i18nSample = 'true';
    const remove = document.createElement('button');
    remove.className = 'play-remove';
    remove.type = 'button';
    remove.textContent = '삭제';
    const hint = document.createElement('small');
    hint.className = 'play-row-hint';
    hint.textContent = '이 칸을 입력해 주세요.';
    hint.hidden = true;
    input.addEventListener('input', () => {
      if (input.value.trim()) clearRowError(row);
      else {
        row.classList.add('is-empty');
        input.setAttribute('aria-invalid', 'true');
        hint.hidden = false;
      }
    });
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const current = rows();
      const position = current.indexOf(row);
      if (position === current.length - 1 && current.length < max) add('', true);
      else safeFocus(current[position + 1]?.querySelector('input'));
    });
    remove.addEventListener('click', () => { row.remove(); sync(); safeFocus(rows()[0]?.querySelector('input')); });
    row.append(index, input, remove, hint);
    container.append(row);
    sync();
    if (focus) safeFocus(input);
  }
  function getValues() {
    const empty = [];
    const values = rows().map((row, index) => {
      const input = row.querySelector('input');
      const value = input.value.trim();
      if (!value) {
        empty.push(index + 1);
        row.classList.add('is-empty');
        input.setAttribute('aria-invalid', 'true');
        row.querySelector('.play-row-hint').hidden = false;
      }
      return value;
    });
    if (empty.length) {
      safeFocus(rows()[empty[0] - 1].querySelector('input'));
      throw new Error(`${label} ${empty.join(', ')}번 칸을 채워 주세요.`);
    }
    return values;
  }
  function setValues(values) {
    container.replaceChildren();
    values.slice(0, max).forEach((value) => add(String(value), false));
    while (rows().length < min) add('', false);
    sync();
  }
  addButton.addEventListener('click', () => add('', true));
  initialValues.forEach((value) => add(value, false));
  sync();
  return { add, getValues, setValues, count: () => rows().length };
}

export function setupPairedListEditor({ container, addButton, initialValues, leftLabel, rightLabel, leftPlaceholder, rightPlaceholder, min = 2, max, leftMaxLength = 24, rightMaxLength = 30 }) {
  function rows() { return [...container.querySelectorAll('.play-pair-row')]; }
  function sync() {
    const current = rows();
    current.forEach((row, index) => {
      row.querySelector('.play-row-index').textContent = index + 1;
      const left = row.querySelector('.play-pair-left');
      const right = row.querySelector('.play-pair-right');
      left.setAttribute('aria-label', `${leftLabel} ${index + 1}`);
      right.setAttribute('aria-label', `${rightLabel} ${index + 1}`);
      const remove = row.querySelector('.play-remove');
      remove.disabled = current.length <= min;
      remove.setAttribute('aria-label', `${index + 1}번 참가자와 결과 삭제`);
    });
    addButton.disabled = current.length >= max;
  }
  function add(value = { left: '', right: '' }, focus = true) {
    if (rows().length >= max) return;
    const row = document.createElement('div');
    row.className = 'play-pair-row';
    const index = document.createElement('span');
    index.className = 'play-row-index';
    const left = document.createElement('input');
    left.className = 'play-pair-left';
    left.type = 'text';
    left.maxLength = leftMaxLength;
    left.placeholder = leftPlaceholder;
    left.value = value.left;
    if (value.left) left.dataset.i18nSample = 'true';
    const right = document.createElement('input');
    right.className = 'play-pair-right';
    right.type = 'text';
    right.maxLength = rightMaxLength;
    right.placeholder = rightPlaceholder;
    right.value = value.right;
    if (value.right) right.dataset.i18nSample = 'true';
    const remove = document.createElement('button');
    remove.className = 'play-remove';
    remove.type = 'button';
    remove.textContent = '삭제';
    const hint = document.createElement('small');
    hint.className = 'play-row-hint';
    hint.textContent = '참가자와 결과를 모두 입력해 주세요.';
    hint.hidden = true;
    [left, right].forEach((input) => input.addEventListener('input', () => {
      if (left.value.trim() && right.value.trim()) clearRowError(row);
      else {
        row.classList.add('is-empty');
        left.toggleAttribute('aria-invalid', !left.value.trim());
        right.toggleAttribute('aria-invalid', !right.value.trim());
        hint.hidden = false;
      }
    }));
    left.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); safeFocus(right); } });
    right.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const current = rows();
      const position = current.indexOf(row);
      if (position === current.length - 1 && current.length < max) add({ left: '', right: '' }, true);
      else safeFocus(current[position + 1]?.querySelector('.play-pair-left'));
    });
    remove.addEventListener('click', () => { row.remove(); sync(); });
    row.append(index, left, right, remove, hint);
    container.append(row);
    sync();
    if (focus) safeFocus(left);
  }
  function getValues() {
    const empty = [];
    const values = rows().map((row, index) => {
      const left = row.querySelector('.play-pair-left');
      const right = row.querySelector('.play-pair-right');
      const value = { left: left.value.trim(), right: right.value.trim() };
      if (!value.left || !value.right) {
        empty.push(index + 1);
        row.classList.add('is-empty');
        if (!value.left) left.setAttribute('aria-invalid', 'true');
        if (!value.right) right.setAttribute('aria-invalid', 'true');
        row.querySelector('.play-row-hint').hidden = false;
      }
      return value;
    });
    if (empty.length) {
      const row = rows()[empty[0] - 1];
      safeFocus(row.querySelector('[aria-invalid="true"]') || row.querySelector('input'));
      throw new Error(`${empty.join(', ')}번 줄의 참가자와 결과를 확인해 주세요.`);
    }
    return values;
  }
  function setValues(values) {
    container.replaceChildren();
    values.slice(0, max).forEach((value) => add({ left: String(value.left || ''), right: String(value.right || '') }, false));
    while (rows().length < min) add({ left: '', right: '' }, false);
    sync();
  }
  addButton.addEventListener('click', () => add({ left: '', right: '' }, true));
  initialValues.forEach((value) => add(value, false));
  sync();
  return { add, getValues, setValues, count: () => rows().length };
}

export async function copyText(value) {
  const text = String(value ?? '');
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    // Blogger iframe permissions may block the modern Clipboard API.
  }

  const previousFocus = document.activeElement;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
  document.body.append(textarea);
  safeFocus(textarea, { preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let copied = false;
  try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
  textarea.remove();
  if (previousFocus instanceof HTMLElement) safeFocus(previousFocus, { preventScroll: true });
  return copied;
}

export function setupEmbedHeight(tool, { content = false, rootSelector = '.play-tool,.simple-tool,.mosaic-tool' } = {}) {
  const root = document.querySelector(rootSelector) || document.body;
  let scheduled = 0;
  let lastHeight = -1;
  const measure = () => {
    scheduled = 0;
    const bodyStyle = getComputedStyle(document.body);
    const paddingBottom = Number.parseFloat(bodyStyle.paddingBottom || 0);
    let height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (content && root !== document.body) {
      const rect = root.getBoundingClientRect();
      height = rect.bottom + window.scrollY + paddingBottom;
    }
    height = Math.max(320, Math.ceil(height));
    if (height === lastHeight) return;
    lastHeight = height;
    parent.postMessage({ source: 'toolbox-embed', tool, height }, '*');
  };
  const send = () => {
    if (scheduled) cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(() => { scheduled = requestAnimationFrame(measure); });
  };
  const resizeObserver = new ResizeObserver(send);
  [document.documentElement, document.body, root].forEach((element, index, list) => {
    if (element && list.indexOf(element) === index) resizeObserver.observe(element);
  });
  new MutationObserver(send).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
  addEventListener('load', send);
  addEventListener('resize', send);
  document.fonts?.ready.then(send);
  root.querySelectorAll('img').forEach((image) => { image.addEventListener('load', send); image.addEventListener('error', send); });
  send();
}
