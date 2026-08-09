import {copyText, setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $ = (selector) => document.querySelector(selector);
const tr = (ko, en) => window.ToolboxI18n?.language === 'en' ? en : ko;
let rows = [];
let result = '';

function setStatus(ko, en, error = false) {
  $('#csv-status').textContent = tr(ko, en);
  $('#csv-status').className = `st-status ${error ? 'is-error' : 'is-good'}`;
}

function detect(text) {
  const first = text.split(/\r?\n/, 1)[0] || '';
  return [',', '\t', ';', '|'].map((value) => [value, (first.match(new RegExp(value === '\t' ? '\\t' : `\\${value}`, 'g')) || []).length]).sort((a, b) => b[1] - a[1])[0][0];
}

function parse(text, delimiter) {
  const parsed = [];
  const row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { value += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else value += character;
    } else if (character === '"' && value === '') quoted = true;
    else if (character === delimiter) { row.push(value); value = ''; }
    else if (character === '\n') { row.push(value.replace(/\r$/, '')); parsed.push([...row]); row.length = 0; value = ''; }
    else value += character;
  }
  if (quoted) throw new Error(tr('닫히지 않은 큰따옴표가 있습니다.', 'A quoted field is not closed.'));
  if (value || row.length) { row.push(value.replace(/\r$/, '')); parsed.push(row); }
  return parsed;
}

function quote(value, delimiter) {
  const text = String(value ?? '');
  return text.includes(delimiter) || /["\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function markdownCell(value) {
  return String(value ?? '').replaceAll('\\', '\\\\').replaceAll('|', '\\|').replace(/\r?\n/g, '<br>');
}

function toMarkdown(width) {
  const headerEnabled = $('#csv-header').checked;
  const header = headerEnabled ? rows[0] : Array.from({length: width}, (_, index) => tr(`열 ${index + 1}`, `Column ${index + 1}`));
  const body = headerEnabled ? rows.slice(1) : rows;
  const line = (row) => `| ${row.map(markdownCell).join(' | ')} |`;
  return [line(header), line(Array.from({length: width}, () => '---')), ...body.map(line)].join('\n');
}

function renderTable(width) {
  const table = $('#csv-table');
  table.replaceChildren();
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  const header = $('#csv-header').checked ? rows[0] : Array.from({length: width}, (_, index) => tr(`열 ${index + 1}`, `Column ${index + 1}`));
  header.forEach((value) => { const cell = document.createElement('th'); cell.textContent = value; headRow.append(cell); });
  head.append(headRow);
  table.append(head);
  const body = document.createElement('tbody');
  const start = $('#csv-header').checked ? 1 : 0;
  rows.slice(start, start + 100).forEach((row) => { const tableRow = document.createElement('tr'); row.forEach((value) => { const cell = document.createElement('td'); cell.textContent = value; tableRow.append(cell); }); body.append(tableRow); });
  table.append(body);
}

function convert() {
  const source = $('#csv-input').value;
  if (!source.trim()) throw new Error(tr('CSV 또는 TSV 내용을 입력해 주세요.', 'Enter CSV or TSV content.'));
  const selectedDelimiter = $('#csv-delimiter').value;
  const delimiter = selectedDelimiter === 'auto' ? detect(source) : selectedDelimiter === 'tab' ? '\t' : selectedDelimiter;
  rows = parse(source, delimiter);
  if ($('#csv-trim-cells').checked) rows = rows.map((row) => row.map((value) => value.trim()));
  if ($('#csv-empty-rows').checked) rows = rows.filter((row) => row.some((value) => String(value).trim() !== ''));
  if (!rows.length) throw new Error(tr('표시할 행이 없습니다.', 'There are no rows to display.'));
  const width = rows[0].length;
  const mismatched = [];
  rows.forEach((row, index) => { if (row.length !== width) mismatched.push(index + 1); });
  if (mismatched.length) throw new Error(tr(`열 개수가 다른 행: ${mismatched.slice(0, 12).join(', ')}`, `Rows with a different column count: ${mismatched.slice(0, 12).join(', ')}`));
  const output = $('#csv-output').value;
  if (output === 'json') {
    const header = $('#csv-header').checked ? rows[0] : Array.from({length: width}, (_, index) => `column${index + 1}`);
    const body = $('#csv-header').checked ? rows.slice(1) : rows;
    result = JSON.stringify(body.map((row) => Object.fromEntries(header.map((key, index) => [key || `column${index + 1}`, row[index]]))), null, 2);
  } else if (output === 'markdown') result = toMarkdown(width);
  else {
    const outputDelimiter = output === 'tsv' ? '\t' : ',';
    result = rows.map((row) => row.map((value) => quote(value, outputDelimiter)).join(outputDelimiter)).join('\n');
  }
  renderTable(width);
  setStatus(`${rows.length}행 · ${width}열을 읽었습니다. 표는 최대 100행까지 표시합니다.`, `Read ${rows.length} rows and ${width} columns. The preview shows up to 100 rows.`);
}

function update() {
  $('#csv-fallback').hidden = true;
  try { convert(); }
  catch (error) { rows = []; result = ''; $('#csv-table').replaceChildren(); setStatus(error.message, error.message, true); }
}

let timer;
$('#csv-input').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(update, 180); });
['#csv-delimiter', '#csv-output', '#csv-header', '#csv-empty-rows', '#csv-trim-cells'].forEach((selector) => $(selector).addEventListener('change', update));
$('#csv-file').addEventListener('change', async () => {
  const file = $('#csv-file').files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) return setStatus('5MB 이하 파일을 선택해 주세요.', 'Choose a file up to 5MB.', true);
  $('#csv-input').value = await file.text();
  update();
});
const drop = $('#csv-drop');
['dragenter', 'dragover'].forEach((type) => drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add('is-over'); }));
['dragleave', 'drop'].forEach((type) => drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.remove('is-over'); }));
drop.addEventListener('drop', (event) => { const file = event.dataTransfer.files[0]; if (file) { const transfer = new DataTransfer(); transfer.items.add(file); $('#csv-file').files = transfer.files; $('#csv-file').dispatchEvent(new Event('change')); } });
$('#csv-copy').addEventListener('click', async () => {
  if (!result) return setStatus('복사할 변환 결과가 없습니다.', 'There is no converted result to copy.', true);
  if (await copyText(result)) { setStatus('변환 결과를 복사했습니다.', 'Converted result copied.'); $('#csv-fallback').hidden = true; }
  else { $('#csv-fallback').value = result; $('#csv-fallback').hidden = false; setStatus('자동 복사가 차단되어 직접 복사할 결과를 표시했습니다.', 'Automatic copying was blocked. A manual copy field is shown.', true); }
});
$('#csv-save').addEventListener('click', () => {
  if (!result) return setStatus('저장할 변환 결과가 없습니다.', 'There is no converted result to save.', true);
  const type = $('#csv-output').value;
  const extension = type === 'markdown' ? 'md' : type;
  const blob = new Blob([result], {type: 'text/plain;charset=utf-8'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `converted.${extension}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});
addEventListener('toolbox-language-change',()=>{$('#csv-tool').setAttribute('aria-label',tr('CSV 표 보기·변환기','CSV table viewer and converter'));update();});
$('#csv-tool').setAttribute('aria-label',tr('CSV 표 보기·변환기','CSV table viewer and converter'));
update();
setupEmbedHeight('csv-table-converter', {content: true});
