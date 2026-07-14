import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const secretDir = path.join(root, '.secrets', 'blogger');
const outputsDir = path.join(root, 'outputs');
const credentialsDocument = JSON.parse(await fs.readFile(path.join(secretDir, 'credentials.json'), 'utf8'));
const credentials = credentialsDocument.installed || credentialsDocument.web;
const blog = JSON.parse(await fs.readFile(path.join(secretDir, 'blog.json'), 'utf8'));
const tokenPath = path.join(secretDir, 'token.json');
let token = JSON.parse(await fs.readFile(tokenPath, 'utf8'));

if (!credentials?.client_id || !credentials?.client_secret || !blog?.id) {
  throw new Error('Blogger OAuth credentials and blog configuration are required.');
}

async function refreshAccessToken() {
  if (!token.refresh_token) throw new Error('OAuth refresh token is missing. Run blogger-auth.mjs again.');
  const response = await fetch(credentials.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: token.refresh_token,
      grant_type: 'refresh_token',
    }),
  });
  const refreshed = await response.json();
  if (!response.ok) throw new Error(refreshed.error_description || refreshed.error || 'Token refresh failed.');
  token = { ...token, ...refreshed, created_at: Date.now() };
  await fs.writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { mode: 0o600 });
}

const expiresAt = Number(token.created_at || 0) + Number(token.expires_in || 0) * 1000;
if (!token.access_token || Date.now() >= expiresAt - 60_000) await refreshAccessToken();

async function request(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    ...options,
    headers: { authorization: `Bearer ${token.access_token}`, 'content-type': 'application/json', ...options.headers },
  });
  const document = await response.json();
  if (!response.ok) throw new Error(document.error?.message || `Blogger request failed: ${response.status}`);
  return document;
}

async function loadPublishedPosts() {
  const posts = [];
  let pageToken = '';
  do {
    const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts`);
    endpoint.search = new URLSearchParams({ fetchBodies: 'true', maxResults: '500', status: 'LIVE', ...(pageToken ? { pageToken } : {}) });
    const document = await request(endpoint);
    posts.push(...(document.items || []));
    pageToken = document.nextPageToken || '';
  } while (pageToken);
  return posts;
}

const normalize = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko');
const compact = (value) => normalize(value).match(/[\p{L}\p{N}]+/gu)?.join('') || '';
const posts = await loadPublishedPosts();
const toolNames = process.argv.slice(2);
const entries = await fs.readdir(outputsDir, { withFileTypes: true });
let updated = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || (toolNames.length && !toolNames.includes(entry.name))) continue;
  const versionsPath = path.join(outputsDir, entry.name, 'versions.json');
  let versions;
  try { versions = JSON.parse(await fs.readFile(versionsPath, 'utf8')); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  const matches = posts.filter((post) => normalize(post.title) === normalize(versions.title) || compact(post.title).endsWith(compact(versions.title)));
  if (matches.length !== 1) throw new Error(`Expected one published post for ${versions.title}, found ${matches.length}.`);
  const latest = versions.versions.find((item) => item.version === versions.latestVersion);
  if (!latest) throw new Error(`Latest version metadata is missing for ${versions.tool}.`);
  const content = await fs.readFile(path.join(outputsDir, entry.name, latest.html), 'utf8');
  const post = matches[0];
  await request(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts/${encodeURIComponent(post.id)}`, {
    method: 'PUT',
    body: JSON.stringify({ ...post, content }),
  });
  console.log(`Updated LIVE post: ${post.title} (${post.url})`);
  updated += 1;
}

if (!updated) throw new Error('No matching tool posts were updated.');
console.log(`Updated ${updated} Blogger post(s).`);
