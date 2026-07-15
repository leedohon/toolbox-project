const PREFIX = 'TB1-';
const MAX_CODE_LENGTH = 20000;

function bytesToBase64Url(bytes) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  let normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4) normalized += '=';
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) throw new Error('올바른 결과 코드가 아닙니다.');
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function encodeResultCode(tool, data) {
  const code = PREFIX + bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ v: 1, t: tool, d: data })));
  if (code.length > MAX_CODE_LENGTH) throw new Error('결과 코드가 너무 깁니다. 입력 항목을 줄여 주세요.');
  return code;
}

export function decodeResultCode(code, expectedTool) {
  const value = String(code || '').trim();
  if (!value) throw new Error('받은 결과 코드를 붙여넣어 주세요.');
  if (value.length > MAX_CODE_LENGTH) throw new Error('결과 코드가 너무 깁니다. 입력 항목을 줄여 주세요.');
  if (!value.startsWith(PREFIX)) throw new Error('올바른 결과 코드가 아닙니다.');
  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(value.slice(PREFIX.length))));
    if (!parsed || parsed.v !== 1 || typeof parsed.t !== 'string' || !parsed.d || typeof parsed.d !== 'object') throw new Error('invalid');
    if (parsed.t !== expectedTool) throw new Error('other-tool');
    return parsed.d;
  } catch (error) {
    if (error.message === 'other-tool') throw new Error('이 코드는 다른 놀이 도구에서 만든 코드입니다.');
    if (error.message === '결과 코드가 너무 깁니다. 입력 항목을 줄여 주세요.' || error.message === '받은 결과 코드를 붙여넣어 주세요.') throw error;
    throw new Error('올바른 결과 코드가 아닙니다.');
  }
}

export async function copyResultCode(code, input) {
  input.value = code;
  try {
    await navigator.clipboard.writeText(code);
  } catch (error) {
    window.ToolboxUX?.focusAndSelect(input);
    document.execCommand('copy');
  }
}

function wrappedLines(context, value, maxWidth) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? line + ' ' + word : word;
    if (line && context.measureText(next).width > maxWidth) { lines.push(line); line = word; }
    else line = next;
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

export function downloadResultPng({ title, subtitle, sections, filename = 'toolbox-result.png', footer = '' }) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = 1200;
  const padding = 76;
  const contentWidth = width - padding * 2;
  context.font = '700 32px Arial, sans-serif';
  const prepared = sections.map((section) => ({ heading: section.heading, lines: section.lines.flatMap((line) => wrappedLines(context, line, contentWidth - 64)) }));
  const sectionHeights = prepared.map((section) => 78 + section.lines.length * 46 + 30);
  const height = Math.max(720, 250 + sectionHeights.reduce((sum, value) => sum + value, 0) + 120);
  canvas.width = width;
  canvas.height = height;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#0879b2';
  context.fillRect(0, 0, width, 22);
  context.fillStyle = '#16232c';
  context.font = '800 52px Arial, sans-serif';
  context.fillText(title, padding, 105);
  context.fillStyle = '#5d707b';
  context.font = '400 28px Arial, sans-serif';
  wrappedLines(context, subtitle, contentWidth).forEach((line, index) => context.fillText(line, padding, 154 + index * 38));
  let top = 215;
  prepared.forEach((section, sectionIndex) => {
    const boxHeight = sectionHeights[sectionIndex];
    context.fillStyle = '#eefaff';
    context.beginPath();
    context.roundRect(padding, top, contentWidth, boxHeight, 22);
    context.fill();
    context.fillStyle = '#075675';
    context.font = '800 31px Arial, sans-serif';
    context.fillText(section.heading, padding + 30, top + 52);
    context.fillStyle = '#16232c';
    context.font = '700 29px Arial, sans-serif';
    section.lines.forEach((line, lineIndex) => context.fillText(line, padding + 30, top + 100 + lineIndex * 46));
    top += boxHeight + 22;
  });
  context.fillStyle = '#72858f';
  context.font = '400 23px Arial, sans-serif';
  context.fillText(footer, padding, height - 52);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
}
