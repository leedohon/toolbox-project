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

export function parseLines(value, { min = 2, max, maxLength = 40, label = '항목' }) {
  const lines = String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < min || lines.length > max) throw new Error(`${label}은 ${min}~${max}개 입력해 주세요.`);
  if (lines.some((line) => line.length > maxLength)) throw new Error(`${label}은 각각 ${maxLength}자 이하로 입력해 주세요.`);
  return lines;
}

export async function copyText(value) {
  await navigator.clipboard.writeText(value);
}

export function setupEmbedHeight(tool) {
  const send = () => parent.postMessage({ source: 'toolbox-embed', tool, height: Math.ceil(document.documentElement.scrollHeight) }, '*');
  new ResizeObserver(send).observe(document.body);
  addEventListener('load', send);
  send();
}
