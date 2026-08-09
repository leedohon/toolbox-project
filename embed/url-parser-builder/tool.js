import {copyText, setupEmbedHeight} from '../../assets/play-tools.js?v=0.3.2';

const $ = (selector) => document.querySelector(selector);
const tr = (ko, en) => window.ToolboxI18n?.language === 'en' ? en : ko;
const sample = 'https://example.com/tools?lang=ko&tag=web&tag=utility#guide';
let parsedUrl = null;

function setStatus(ko, en, error = false) {
  $('#url-status').textContent = tr(ko, en);
  $('#url-status').className = `st-status ${error ? 'is-error' : 'is-good'}`;
}

function addRow(name = '', value = '') {
  const row = document.createElement('div');
  row.className = 'up-query-row';
  row.innerHTML = `<span class="up-query-number"></span><label class="up-cell up-name-cell"><span class="up-field-label"></span><input class="up-name" type="text" maxlength="1000"></label><label class="up-cell up-value-cell"><span class="up-field-label"></span><input class="up-value" type="text" maxlength="10000"></label><button class="st-secondary up-delete" type="button"></button>`;
  row.querySelector('.up-name').value = name;
  row.querySelector('.up-value').value = value;
  row.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', rebuild);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); addRow(); }
    });
  });
  row.querySelector('.up-delete').addEventListener('click', () => { row.remove(); if (!$('#url-query-list').children.length) addRow(); numberRows(); rebuild(); });
  $('#url-query-list').append(row);
  numberRows();
  translateRows();
}

function numberRows() {
  [...$('#url-query-list').children].forEach((row, index) => { row.querySelector('.up-query-number').textContent = String(index + 1); });
}

function translateRows() {
  [...$('#url-query-list').children].forEach((row, index) => {
    const name = row.querySelector('.up-name');
    const value = row.querySelector('.up-value');
    name.placeholder = tr(`항목 ${index + 1} 이름`, `Parameter ${index + 1} name`);
    value.placeholder = tr(`항목 ${index + 1} 값`, `Parameter ${index + 1} value`);
    name.setAttribute('aria-label', name.placeholder);
    value.setAttribute('aria-label', value.placeholder);
    row.querySelector('.up-name-cell .up-field-label').textContent = tr('이름', 'Name');
    row.querySelector('.up-value-cell .up-field-label').textContent = tr('값', 'Value');
    row.querySelector('.up-delete').textContent = tr('삭제', 'Delete');
  });
}

function parse() {
  $('#url-fallback').hidden = true;
  try {
    const url = new URL($('#url-input').value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
    if (url.username || url.password) throw new Error('credentials');
    parsedUrl = url;
    $('#url-protocol').value = url.protocol;
    $('#url-host').value = url.hostname;
    $('#url-port').value = url.port || tr('기본 포트', 'Default port');
    $('#url-path').value = url.pathname;
    $('#url-hash').value = url.hash;
    $('#url-query-list').replaceChildren();
    url.searchParams.forEach((value, name) => addRow(name, value));
    if (!$('#url-query-list').children.length) addRow();
    $('#url-editor').hidden = false;
    rebuild();
    setStatus('URL을 분석했습니다.', 'URL parsed.');
  } catch (error) {
    parsedUrl = null;
    $('#url-editor').hidden = true;
    setStatus(error.message === 'credentials' ? '로그인 정보가 포함된 URL은 처리하지 않습니다.' : 'http 또는 https로 시작하는 올바른 전체 URL을 입력해 주세요.', error.message === 'credentials' ? 'URLs containing sign-in information are not accepted.' : 'Enter a valid full URL starting with http or https.', true);
  }
}

function rebuild() {
  if (!parsedUrl) return;
  $('#url-fallback').hidden = true;
  const rows = [...$('#url-query-list').children];
  let invalid = false;
  const params = new URLSearchParams();
  rows.forEach((row) => {
    const name = row.querySelector('.up-name').value.trim();
    const value = row.querySelector('.up-value').value;
    row.classList.toggle('is-error', !name);
    row.querySelector('.up-name').setAttribute('aria-invalid', String(!name));
    if (!name) invalid = true;
    else params.append(name, value);
  });
  if (invalid) {
    $('#url-output').textContent = '';
    return setStatus('이름이 비어 있는 쿼리 행을 채우거나 삭제해 주세요.', 'Fill or delete the query row with an empty name.', true);
  }
  const next = new URL(parsedUrl.href);
  next.pathname = $('#url-path').value || '/';
  next.hash = $('#url-hash').value;
  next.search = params.toString();
  $('#url-output').textContent = next.href;
  $('#url-fallback').hidden = true;
  setStatus('완성 URL을 갱신했습니다.', 'Rebuilt URL updated.');
}

$('#url-parse').addEventListener('click', parse);
$('#url-blog-sample').addEventListener('click', () => { $('#url-input').value = 'https://blog.example.com/posts/toolbox?utm_source=newsletter&utm_medium=email&tag=web#guide'; $('#url-fallback').hidden = true; parse(); });
const apiSample=document.createElement('button');apiSample.className='st-secondary';apiSample.id='url-api-sample';apiSample.type='button';apiSample.dataset.ko='API 주소 예제';apiSample.dataset.en='API URL example';apiSample.textContent=tr('API 주소 예제','API URL example');$('#url-blog-sample').after(apiSample);apiSample.addEventListener('click',()=>{$('#url-input').value='https://api.example.com/v1/tools?limit=20&page=2&sort=updated#results';$('#url-fallback').hidden=true;parse();});
$('#url-input').addEventListener('input', parse);
$('#url-path').addEventListener('input', rebuild);
$('#url-hash').addEventListener('input', rebuild);
$('#url-add').addEventListener('click', () => { addRow(); rebuild(); });
$('#url-sort').addEventListener('click', () => {
  const entries = [...$('#url-query-list').querySelectorAll('.up-query-row')].map((row, index) => ({name: row.querySelector('.up-name').value, value: row.querySelector('.up-value').value, index}));
  entries.sort((left, right) => left.name.localeCompare(right.name, undefined, {sensitivity: 'base'}) || left.index - right.index);
  $('#url-query-list').replaceChildren();
  entries.forEach(({name, value}) => addRow(name, value));
  rebuild();
  setStatus('쿼리 항목을 이름순으로 정렬했습니다.', 'Query parameters sorted by name.');
});
$('#url-add-utm').addEventListener('click', () => {
  const existing = new Set([...$('#url-query-list').querySelectorAll('.up-name')].map((input) => input.value.trim().toLowerCase()));
  let added = 0;
  [['utm_source', ''], ['utm_medium', ''], ['utm_campaign', '']].forEach(([name, value]) => { if (!existing.has(name)) { addRow(name, value); added += 1; } });
  rebuild();
  setStatus(added ? `${added}개의 UTM 기본 항목을 추가했습니다.` : 'UTM 기본 항목이 이미 모두 있습니다.', added ? `Added ${added} missing UTM field${added === 1 ? '' : 's'}.` : 'All standard UTM fields are already present.');
});
$('#url-copy').addEventListener('click', async () => {
  const value = $('#url-output').textContent;
  if (!value) return setStatus('복사할 완성 URL이 없습니다.', 'There is no rebuilt URL to copy.', true);
  if (await copyText(value)) setStatus('완성 URL을 복사했습니다.', 'Rebuilt URL copied.');
  else { $('#url-fallback').value = value; $('#url-fallback').hidden = false; setStatus('자동 복사가 차단되어 직접 복사할 주소를 표시했습니다.', 'Automatic copying was blocked. A manual copy field is shown.', true); }
});
$('#url-reset').addEventListener('click', () => { $('#url-input').value = sample; parse(); });
addEventListener('toolbox-language-change', () => { translateRows(); if (parsedUrl) { $('#url-port').value = parsedUrl.port || tr('기본 포트', 'Default port'); rebuild(); } });
parse();
setupEmbedHeight('url-parser-builder', {content: true});
