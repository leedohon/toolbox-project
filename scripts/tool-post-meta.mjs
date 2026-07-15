import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tagsPath = path.join(root, 'toolbox', 'post-tags.json');

export function formatToolPostTitle(title) {
  return `[초간단 툴박스] ${title}`;
}

export async function loadToolPostLabels(tool) {
  const document = JSON.parse(await fs.readFile(tagsPath, 'utf8'));
  const labels = [...(document.common || []), ...(document.tools?.[tool] || [])];
  const unique = [...new Set(labels.map((label) => String(label).trim()).filter(Boolean))];
  if (unique.length < 4 || unique.length > 10) throw new Error(`${tool}: 4~10개의 게시글 라벨이 필요합니다.`);
  return unique;
}
