import { copyText, setupEmbedHeight } from '../../assets/play-tools.js?v=0.3.2';

const $ = (selector) => document.querySelector(selector);
const tr = (ko, en) => window.ToolboxI18n?.language === 'en' ? en : ko;
let payloadText = '';

function status(ko, en, error = false) {
  const element = $('#jwt-status');
  element.textContent = tr(ko, en);
  element.className = `st-status ${error ? 'is-error' : 'is-good'}`;
}

function decode(part) {
  const normalized = part.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function readableDuration(milliseconds) {
  const absolute = Math.abs(milliseconds);
  const units = [
    [86_400_000, '일', 'day'],
    [3_600_000, '시간', 'hour'],
    [60_000, '분', 'minute'],
  ];
  const [size, koUnit, enUnit] = units.find(([size]) => absolute >= size) || [1_000, '초', 'second'];
  const amount = Math.max(1, Math.round(absolute / size));
  return tr(`${amount}${koUnit}`, `${amount} ${enUnit}${amount === 1 ? '' : 's'}`);
}

function timeSummary(payload) {
  const now = Date.now();
  const lines = [];
  for (const key of ['iat', 'nbf', 'exp']) {
    if (!Number.isFinite(payload[key])) continue;
    const date = new Date(payload[key] * 1000);
    lines.push(`${key}: ${Number.isNaN(date.valueOf()) ? tr('잘못된 시각', 'Invalid date') : date.toLocaleString(window.ToolboxI18n?.language === 'en' ? 'en-US' : 'ko-KR')}`);
  }
  if (Number.isFinite(payload.nbf) && payload.nbf * 1000 > now) {
    lines.push(tr(`${readableDuration(payload.nbf * 1000 - now)} 뒤부터 유효`, `Valid in ${readableDuration(payload.nbf * 1000 - now)}`));
  }
  if (Number.isFinite(payload.exp)) {
    const difference = payload.exp * 1000 - now;
    lines.push(difference <= 0
      ? tr(`${readableDuration(difference)} 전에 만료된 값`, `Expired ${readableDuration(difference)} ago`)
      : tr(`만료까지 약 ${readableDuration(difference)}`, `About ${readableDuration(difference)} until expiry`));
  }
  return lines.join(' · ') || tr('표시할 대표 시간 항목이 없습니다.', 'No standard time claims were found.');
}

function claimValue(value) {
  if (value === undefined || value === null || value === '') return tr('없음', 'Not present');
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function renderClaims(header, payload) {
  const items = [
    [tr('알고리즘', 'Algorithm'), claimValue(header.alg)],
    [tr('발급자', 'Issuer'), claimValue(payload.iss)],
    [tr('주체', 'Subject'), claimValue(payload.sub)],
    [tr('대상', 'Audience'), claimValue(payload.aud)],
    [tr('토큰 ID', 'Token ID'), claimValue(payload.jti)]
  ];
  $('#jwt-claims').replaceChildren(...items.map(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'wf-stat';
    const strong = document.createElement('strong');
    const span = document.createElement('span');
    strong.textContent = value;
    span.textContent = label;
    item.append(strong, span);
    return item;
  }));
  const warnings = [tr('표시된 내용만으로 토큰을 신뢰하지 마세요. 서명은 검증하지 않았습니다.', 'Do not trust the token from decoded contents alone; the signature was not verified.')];
  if (String(header.alg || '').toLowerCase() === 'none') warnings.unshift(tr('alg가 none인 토큰입니다.', 'This token uses alg none.'));
  if (!Number.isFinite(payload.exp)) warnings.push(tr('만료 시각 exp가 없습니다.', 'No exp expiry claim is present.'));
  $('#jwt-risk').textContent = warnings.join(' ');
}

function run() {
  try {
    const token = $('#jwt-input').value.trim();
    const parts = token.split('.');
    if (parts.length !== 3 || parts.some((part) => !part)) {
      throw new Error(tr('점으로 구분된 세 구간 JWT를 입력해 주세요.', 'Enter a JWT with three dot-separated segments.'));
    }
    const header = decode(parts[0]);
    const payload = decode(parts[1]);
    payloadText = JSON.stringify(payload, null, 2);
    $('#jwt-header').value = JSON.stringify(header, null, 2);
    $('#jwt-payload').value = payloadText;
    renderClaims(header, payload);
    $('#jwt-times').textContent = timeSummary(payload);
    $('#jwt-result').hidden = false;
    $('#jwt-fallback').hidden = true;
    status('내용을 열었습니다. 표시된 값과 별개로 서명은 검증하지 않았습니다.', 'Contents decoded. The signature was not verified.');
  } catch (error) {
    payloadText = '';
    $('#jwt-claims').replaceChildren();
    $('#jwt-risk').textContent = '';
    $('#jwt-result').hidden = true;
    $('#jwt-fallback').hidden = true;
    status(`JWT를 확인해 주세요: ${error.message}`, `Check the JWT: ${error.message}`, true);
  }
}

$('#jwt-run').addEventListener('click', run);
$('#jwt-input').addEventListener('input', () => {
  $('#jwt-result').hidden = true;
  $('#jwt-fallback').hidden = true;
  $('#jwt-claims').replaceChildren();
  $('#jwt-risk').textContent = '';
  payloadText = '';
});
$('#jwt-copy').addEventListener('click', async () => {
  if (!payloadText) return status('먼저 JWT 내용을 여세요.', 'Decode a JWT first.', true);
  if (await copyText(payloadText)) {
    $('#jwt-fallback').hidden = true;
    status('페이로드 JSON을 복사했습니다.', 'Payload JSON copied.');
  } else {
    $('#jwt-fallback').value = payloadText;
    $('#jwt-fallback').hidden = false;
    status('아래 내용을 직접 복사해 주세요.', 'Copy the text below manually.');
  }
});
$('#jwt-reset').addEventListener('click', () => {
  $('#jwt-input').value = '';
  $('#jwt-result').hidden = true;
  $('#jwt-fallback').hidden = true;
  payloadText = '';
  status('입력을 비웠습니다.', 'Input cleared.');
});
addEventListener('toolbox-language-change', () => {
  if (payloadText) run();
});

setupEmbedHeight('jwt-decoder', { content: true });
