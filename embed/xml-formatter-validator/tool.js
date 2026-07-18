import {copyText, setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $ = (selector) => document.querySelector(selector);
const tr = (ko, en) => window.ToolboxI18n?.language === 'en' ? en : ko;
const sample = '<?xml version="1.0" encoding="UTF-8"?>\n<tools>\n  <tool id="1">Toolbox</tool>\n</tools>';

function setStatus(ko, en, error = false) {
  $('#xml-status').textContent = tr(ko, en);
  $('#xml-status').className = `st-status ${error ? 'is-error' : 'is-good'}`;
}

function parseXml(source) {
  const documentNode = new DOMParser().parseFromString(source, 'application/xml');
  const parserError = documentNode.querySelector('parsererror');
  if (parserError) throw new Error(parserError.textContent.replace(/\s+/g, ' ').trim().slice(0, 260));
  return documentNode;
}

function formatXml(source, indent) {
  const parsed = parseXml(source);
  const serialized = new XMLSerializer().serializeToString(parsed);
  if (!indent) return serialized.replace(/>\s+</g, '><').trim();
  const lines = serialized.replace(/>\s*</g, '>\n<').split('\n');
  let depth = 0;
  return lines.map((line) => {
    const trimmed = line.trim();
    if (/^<\/(?!\?)/.test(trimmed)) depth = Math.max(0, depth - 1);
    const value = `${indent.repeat(depth)}${trimmed}`;
    if (/^<(?!\/|\?|!)[^>]+[^/]>/i.test(trimmed) && !/<\/[^>]+>\s*$/.test(trimmed)) depth += 1;
    return value;
  }).join('\n');
}

function render() {
  const source = $('#xml-input').value.trim();
  if (!source) {
    $('#xml-result').hidden = true;
    $('#xml-output').value = '';
    return setStatus('XML을 입력해 주세요.', 'Enter XML.', true);
  }
  try {
    const mode = $('input[name="xml-mode"]:checked').value;
    $('#xml-output').value = formatXml(source, mode === 'two' ? '  ' : mode === 'four' ? '    ' : '');
    $('#xml-result').hidden = false;
    $('#xml-fallback').hidden = true;
    setStatus('올바른 XML입니다. 결과를 만들었습니다.', 'Valid XML. The result is ready.');
  } catch (error) {
    $('#xml-result').hidden = true;
    $('#xml-output').value = '';
    setStatus(`XML 오류: ${error.message}`, `XML error: ${error.message}`, true);
  }
}

$('#xml-run').addEventListener('click', render);
$('#xml-input').addEventListener('input', render);
document.querySelectorAll('input[name="xml-mode"]').forEach((control) => control.addEventListener('change', render));
$('#xml-copy').addEventListener('click', async () => {
  if (!$('#xml-output').value) return setStatus('복사할 결과가 없습니다.', 'There is no result to copy.', true);
  if (await copyText($('#xml-output').value)) {
    $('#xml-fallback').hidden = true;
    setStatus('XML 결과를 복사했습니다.', 'XML result copied.');
  } else {
    $('#xml-fallback').value = $('#xml-output').value;
    $('#xml-fallback').hidden = false;
    setStatus('자동 복사가 차단되어 직접 복사할 결과를 표시했습니다.', 'Automatic copying was blocked. A manual copy field is shown.', true);
  }
});
$('#xml-save').addEventListener('click', () => {
  if (!$('#xml-output').value) return setStatus('저장할 결과가 없습니다.', 'There is no result to save.', true);
  const url = URL.createObjectURL(new Blob([$('#xml-output').value], {type: 'application/xml;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'formatted.xml';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus('XML 파일을 저장했습니다.', 'XML file saved.');
});
$('#xml-reset').addEventListener('click', () => {
  $('#xml-input').value = sample;
  document.querySelector('input[name="xml-mode"][value="two"]').checked = true;
  render();
  window.ToolboxUX?.focus($('#xml-input'));
});
addEventListener('toolbox-language-change', render);
render();
setupEmbedHeight('xml-formatter-validator', {content: true});
