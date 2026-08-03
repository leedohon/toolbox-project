import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const secretDir = path.join(root, '.secrets', 'blogger');
const pageDir = path.join(root, 'toolbox', 'pages');
const siteConfigPath = path.join(root, 'outputs', 'site.json');
const apply = process.argv.includes('--apply');
const dryRun = process.argv.includes('--dry-run') || !apply;
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const definitions = [
  { key: 'contact', title: '문의하기', file: 'contact.html', label: '문의' },
  { key: 'about', title: '사이트 소개', file: 'about.html', label: '소개' },
  { key: 'privacy', title: '개인정보 처리방침', file: 'privacy-policy.html', label: '개인정보 처리방침' },
];
const selected = requested.length ? definitions.filter((item) => requested.includes(item.key)) : definitions;

if (!selected.length || (requested.length && selected.length !== requested.length)) {
  const known = new Set(definitions.map((item) => item.key));
  const unknown = requested.filter((key) => !known.has(key));
  throw new Error(`Unknown page key(s): ${unknown.join(', ') || '(none)'}`);
}

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
    headers: {
      authorization: `Bearer ${token.access_token}`,
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const document = await response.json();
  if (!response.ok) throw new Error(document.error?.message || `Blogger request failed: ${response.status}`);
  return document;
}

async function loadPages() {
  const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/pages`);
  endpoint.search = new URLSearchParams({ fetchBodies: 'true', maxResults: '50', status: 'LIVE' });
  const document = await request(endpoint);
  return document.items || [];
}

function renderPage(source, pageUrls) {
  return source.replace(/\{\{([a-z]+)Url\}\}/g, (_, key) => {
    const url = pageUrls.get(key);
    if (!url) throw new Error(`Static page URL is not available for placeholder: ${key}`);
    return url;
  });
}

const livePages = await loadPages();
const duplicates = definitions.filter((definition) => livePages.filter((page) => page.title === definition.title).length > 1);
if (duplicates.length) throw new Error(`Duplicate Blogger page titles: ${duplicates.map((item) => item.title).join(', ')}`);

const pageUrls = new Map();
for (const definition of definitions) {
  const page = livePages.find((item) => item.title === definition.title);
  if (page?.url) pageUrls.set(definition.key, page.url);
}

const plans = [];
for (const definition of selected) {
  const source = await fs.readFile(path.join(pageDir, definition.file), 'utf8');
  const existing = livePages.find((page) => page.title === definition.title);
  plans.push({ definition, source, existing, action: existing ? 'update' : 'create' });
}

console.log(`Preflight passed for ${plans.length} static page(s).`);
for (const plan of plans) {
  console.log(`${plan.action.toUpperCase()}: ${plan.definition.title}${plan.existing?.url ? ` (${plan.existing.url})` : ''}`);
}
if (dryRun) {
  console.log('Dry run only. Re-run with --apply to change Blogger and outputs/site.json.');
  process.exit(0);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(root, 'work', 'blogger-page-backups');
await fs.mkdir(backupDir, { recursive: true });
await fs.writeFile(
  path.join(backupDir, `static-pages-${timestamp}.json`),
  `${JSON.stringify({ createdAt: new Date().toISOString(), pages: livePages }, null, 2)}\n`,
);

for (const plan of plans) {
  const content = renderPage(plan.source, pageUrls);
  let page;
  if (plan.existing) {
    page = await request(
      `https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/pages/${encodeURIComponent(plan.existing.id)}`,
      { method: 'PUT', body: JSON.stringify({ ...plan.existing, title: plan.definition.title, content }) },
    );
  } else {
    const endpoint = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(blog.id)}/pages`);
    endpoint.searchParams.set('isDraft', 'false');
    page = await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ kind: 'blogger#page', title: plan.definition.title, content }),
    });
  }
  if (!page?.url) throw new Error(`Blogger did not return a public URL for ${plan.definition.title}.`);
  pageUrls.set(plan.definition.key, page.url);
  console.log(`${plan.action === 'create' ? 'Created' : 'Updated'} LIVE page: ${plan.definition.title} (${page.url})`);
}

const siteConfig = JSON.parse(await fs.readFile(siteConfigPath, 'utf8'));
siteConfig.updatedAt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
siteConfig.legalLinks = definitions.map((definition) => {
  const url = pageUrls.get(definition.key);
  if (!url) throw new Error(`Public URL is missing for ${definition.title}. Publish all three pages before updating site links.`);
  return { key: definition.key, label: definition.label, url };
});
await fs.writeFile(siteConfigPath, `${JSON.stringify(siteConfig, null, 2)}\n`);
console.log('Updated outputs/site.json legalLinks.');
