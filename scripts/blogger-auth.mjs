import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const secretDir = path.join(root, '.secrets', 'blogger');
const credentialsPath = path.join(secretDir, 'credentials.json');
const tokenPath = path.join(secretDir, 'token.json');
const scope = 'https://www.googleapis.com/auth/blogger';

const credentialsDocument = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
const credentials = credentialsDocument.installed;
if (!credentials?.client_id || !credentials?.client_secret) {
  throw new Error('Desktop app OAuth credentials are required.');
}

const base64url = (value) => Buffer.from(value).toString('base64url');
const state = base64url(crypto.randomBytes(24));
const verifier = base64url(crypto.randomBytes(64));
const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());

const result = await new Promise((resolve, reject) => {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, 'http://127.0.0.1');
    if (requestUrl.pathname !== '/oauth2/callback') {
      response.writeHead(404).end('Not found');
      return;
    }
    if (requestUrl.searchParams.get('state') !== state) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Invalid OAuth state.');
      reject(new Error('OAuth state validation failed.'));
      server.close();
      return;
    }
    const error = requestUrl.searchParams.get('error');
    const code = requestUrl.searchParams.get('code');
    response.writeHead(error || !code ? 400 : 200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(error || !code
      ? '<h1>인증에 실패했습니다.</h1><p>이 창을 닫고 터미널의 오류를 확인하세요.</p>'
      : '<h1>Blogger 인증 완료</h1><p>이 창을 닫고 터미널로 돌아가세요.</p>');
    if (error || !code) reject(new Error(error || 'Authorization code was not returned.'));
    else resolve({ code, redirectUri: `http://127.0.0.1:${server.address().port}/oauth2/callback` });
    server.close();
  });
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const redirectUri = `http://127.0.0.1:${server.address().port}/oauth2/callback`;
    const authorizationUrl = new URL(credentials.auth_uri || 'https://accounts.google.com/o/oauth2/auth');
    authorizationUrl.search = new URLSearchParams({
      client_id: credentials.client_id,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      access_type: 'offline',
      prompt: 'consent',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    console.log('\n아래 주소를 브라우저에서 열고 Blogger 관리 계정으로 승인하세요.\n');
    console.log(authorizationUrl.toString());
    console.log('\n승인이 끝날 때까지 이 창을 닫지 마세요.\n');
  });
});

const tokenResponse = await fetch(credentials.token_uri || 'https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code: result.code,
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    redirect_uri: result.redirectUri,
    grant_type: 'authorization_code',
    code_verifier: verifier,
  }),
});
const token = await tokenResponse.json();
if (!tokenResponse.ok) throw new Error(token.error_description || token.error || 'Token exchange failed.');
token.created_at = Date.now();
await fs.writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { mode: 0o600 });

const blogsResponse = await fetch('https://www.googleapis.com/blogger/v3/users/self/blogs', {
  headers: { authorization: `Bearer ${token.access_token}` },
});
const blogs = await blogsResponse.json();
if (!blogsResponse.ok) throw new Error(blogs.error?.message || 'Could not load Blogger blogs.');

console.log('OAuth 토큰을 로컬 전용 폴더에 저장했습니다.');
console.log('게시 가능한 블로그:');
for (const blog of blogs.items || []) console.log(`- ${blog.name}: ${blog.id}`);
