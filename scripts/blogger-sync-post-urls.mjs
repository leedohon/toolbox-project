import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildToolCatalog } from './build-tool-catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const secretDir = path.join(root, '.secrets', 'blogger');
const outputsDir = path.join(root, 'outputs');
const credentialsPath = path.join(secretDir, 'credentials.json');
const tokenPath = path.join(secretDir, 'token.json');
const blogPath = path.join(secretDir, 'blog.json');

const credentialsDocument = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
const credentials = credentialsDocument.installed || credentialsDocument.web;
const blog = JSON.parse(await fs.readFile(blogPath, 'utf8'));
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

async function loadPublishedPosts() {
  const posts = [];
  let pageToken = '';
  do {
    const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/posts`);
    endpoint.search = new URLSearchParams({
      fetchBodies: 'false',
      maxResults: '500',
      status: 'LIVE',
      ...(pageToken ? { pageToken } : {}),
    });
    const response = await fetch(endpoint, { headers: { authorization: `Bearer ${token.access_token}` } });
    const document = await response.json();
    if (!response.ok) throw new Error(document.error?.message || 'Could not load Blogger posts.');
    posts.push(...(document.items || []));
    pageToken = document.nextPageToken || '';
  } while (pageToken);
  return posts;
}

function normalizeTitle(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko');
}

function compactTitle(value) {
  return normalizeTitle(value).match(/[\p{L}\p{N}]+/gu)?.join('') || '';
}

const postsByTitle = new Map();
for (const post of await loadPublishedPosts()) {
  const key = normalizeTitle(post.title);
  if (!postsByTitle.has(key)) postsByTitle.set(key, []);
  postsByTitle.get(key).push(post);
}

const entries = await fs.readdir(outputsDir, { withFileTypes: true });
let updated = 0;
const unmatched = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const versionsPath = path.join(outputsDir, entry.name, 'versions.json');
  let versions;
  try {
    versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  const exactMatches = postsByTitle.get(normalizeTitle(versions.title)) || [];
  const toolTitle = compactTitle(versions.title);
  const suffixMatches = exactMatches.length ? [] : [...postsByTitle.values()]
    .flat()
    .filter((post) => compactTitle(post.title).endsWith(toolTitle));
  const matches = exactMatches.length ? exactMatches : suffixMatches;
  if (matches.length > 1) throw new Error(`Multiple published posts have the same title: ${versions.title}`);
  if (!matches.length) {
    unmatched.push(versions.title);
    continue;
  }
  if (versions.postUrl !== matches[0].url) {
    versions.postUrl = matches[0].url;
    await fs.writeFile(versionsPath, `${JSON.stringify(versions, null, 2)}\n`);
    updated += 1;
  }
}

const catalog = await buildToolCatalog();
console.log(`Synchronized ${updated} post URL(s); catalog contains ${catalog.tools.length} tools.`);
if (unmatched.length) console.log(`No published post match: ${unmatched.join(', ')}`);
