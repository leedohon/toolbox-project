import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildToolCatalog } from './build-tool-catalog.mjs';
import { formatToolPostTitle, loadToolPostLabels } from './tool-post-meta.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const secretDir = path.join(root, '.secrets', 'blogger');
const outputsDir = path.join(root, 'outputs');
const credentialsDocument = JSON.parse(await fs.readFile(path.join(secretDir, 'credentials.json'), 'utf8'));
const credentials = credentialsDocument.installed || credentialsDocument.web;
const blog = JSON.parse(await fs.readFile(path.join(secretDir, 'blog.json'), 'utf8'));
const tokenPath = path.join(secretDir, 'token.json');
let token = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
const tools = process.argv.slice(2);

if (!tools.length) throw new Error('게시할 도구 식별자를 하나 이상 입력해 주세요.');
if (!credentials?.client_id || !credentials?.client_secret || !blog?.id) throw new Error('Blogger OAuth 설정이 필요합니다.');

async function refreshAccessToken() {
  if (!token.refresh_token) throw new Error('OAuth refresh token이 없습니다. blogger-auth.mjs를 다시 실행해 주세요.');
  const response = await fetch(credentials.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: credentials.client_id, client_secret: credentials.client_secret, refresh_token: token.refresh_token, grant_type: 'refresh_token' }),
  });
  const refreshed = await response.json();
  if (!response.ok) throw new Error(refreshed.error_description || refreshed.error || '토큰 갱신에 실패했습니다.');
  token = { ...token, ...refreshed, created_at: Date.now() };
  await fs.writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { mode: 0o600 });
}

const expiresAt = Number(token.created_at || 0) + Number(token.expires_in || 0) * 1000;
if (!token.access_token || Date.now() >= expiresAt - 60_000) await refreshAccessToken();

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { authorization: `Bearer ${token.access_token}`, 'content-type': 'application/json', ...options.headers },
  });
  const document = await response.json();
  if (!response.ok) throw new Error(document.error?.message || `Blogger 요청 실패: ${response.status}`);
  return document;
}

async function loadPublishedPosts() {
  const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts`);
  endpoint.search = new URLSearchParams({ fetchBodies: 'false', maxResults: '500', status: 'LIVE' });
  const document = await request(endpoint);
  return document.items || [];
}

function compact(value) {
  return String(value || '').toLocaleLowerCase('ko').match(/[\p{L}\p{N}]+/gu)?.join('') || '';
}

const published = await loadPublishedPosts();
for (const tool of tools) {
  const versionsPath = path.join(outputsDir, tool, 'versions.json');
  const versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
  const latest = versions.versions.find((release) => release.version === versions.latestVersion);
  if (!latest) throw new Error(`${tool}: 최신 버전 정보가 없습니다.`);
  const content = await fs.readFile(path.join(outputsDir, tool, latest.html), 'utf8');
  const title = formatToolPostTitle(versions.title, versions.category);
  const labels = await loadToolPostLabels(versions.tool);
  const matches = published.filter((post) => (versions.postUrl && post.url === versions.postUrl) || compact(post.title).includes(compact(versions.title)));
  if (matches.length > 1) throw new Error(`${versions.title}: 같은 제목의 공개 글이 여러 개입니다.`);

  let post;
  if (matches.length === 1) {
    post = await request(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts/${encodeURIComponent(matches[0].id)}`, {
      method: 'PUT',
      body: JSON.stringify({ ...matches[0], title, content, labels }),
    });
    console.log(`Updated LIVE post: ${title} (${post.url})`);
  } else {
    const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts/`);
    endpoint.searchParams.set('isDraft', 'false');
    post = await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ kind: 'blogger#post', blog: { id: String(blog.id) }, title, content, labels }),
    });
    console.log(`Published LIVE post: ${title} (${post.url})`);
    published.push(post);
  }

  versions.postUrl = post.url;
  await fs.writeFile(versionsPath, `${JSON.stringify(versions, null, 2)}\n`);
}

const catalog = await buildToolCatalog();
console.log(`Catalog updated with ${catalog.tools.length} tools.`);
