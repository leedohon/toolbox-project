import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicMode = process.argv.slice(2).includes('--public');
const unknownArguments = process.argv.slice(2).filter((argument) => argument !== '--public');
const errors = [];
const checks = {};

const summary = {
  ok: false,
  mode: publicMode ? 'public' : 'local',
  generatedAt: new Date().toISOString(),
  classifications: {
    activePublished: [],
    pending: [],
    retired: [],
  },
  checks,
  errors,
};

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

function fail(check, subject, message, details = undefined) {
  errors.push({
    check,
    subject,
    message,
    ...(details === undefined ? {} : { details }),
  });
}

function finishCheck(name, details = {}) {
  checks[name] = {
    ...details,
    ok: !errors.some((error) => error.check === name),
  };
}

async function readText(filePath, check, subject = relative(filePath)) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    fail(check, subject, `Cannot read ${relative(filePath)}: ${error.message}`);
    return null;
  }
}

async function readJson(filePath, check, subject = relative(filePath)) {
  const source = await readText(filePath, check, subject);
  if (source === null) return null;
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(check, subject, `Invalid JSON in ${relative(filePath)}: ${error.message}`);
    return null;
  }
}

function validPublicUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function classIncludes(attributes, className) {
  return String(attributes.class || '').split(/\s+/).includes(className);
}

function markedSection(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0 || end < start) return null;
  return html.slice(start + startMarker.length, end);
}

function countMatches(source, pattern) {
  return source ? [...source.matchAll(pattern)].length : 0;
}

function toolNames(items) {
  return items.map((item) => item.tool).sort();
}

if (unknownArguments.length) {
  fail('arguments', 'command line', `Unknown argument(s): ${unknownArguments.join(', ')}`);
}
finishCheck('arguments', { public: publicMode });

const outputsDir = path.join(root, 'outputs');
const manifests = new Map();
let outputEntries = [];

try {
  outputEntries = await fs.readdir(outputsDir, { withFileTypes: true });
} catch (error) {
  fail('manifests', 'outputs', `Cannot list outputs: ${error.message}`);
}

for (const entry of outputEntries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const manifestPath = path.join(outputsDir, entry.name, 'versions.json');
  const manifest = await readJson(manifestPath, 'manifests', entry.name);
  if (!manifest) continue;

  const tool = typeof manifest.tool === 'string' && manifest.tool.trim() ? manifest.tool.trim() : entry.name;
  if (!manifest.tool || typeof manifest.tool !== 'string') {
    fail('manifests', entry.name, 'versions.json must contain a non-empty tool identifier');
  } else if (tool !== entry.name) {
    fail('manifests', entry.name, `Manifest tool "${tool}" does not match its output directory`);
  }
  if (manifests.has(tool)) {
    fail('manifests', tool, 'Duplicate tool manifest');
    continue;
  }

  const postUrl = typeof manifest.postUrl === 'string' ? manifest.postUrl.trim() : '';
  if (postUrl && !validPublicUrl(postUrl)) {
    fail('manifests', tool, `Invalid postUrl: ${postUrl}`);
  }

  const record = {
    tool,
    folder: entry.name,
    postUrl,
    status: typeof manifest.status === 'string' ? manifest.status : '',
    replacementTool: typeof manifest.replacementTool === 'string' ? manifest.replacementTool.trim() : '',
    latestVersion: typeof manifest.latestVersion === 'string' ? manifest.latestVersion : '',
    manifest,
  };
  manifests.set(tool, record);

  if (record.status === 'retired') {
    summary.classifications.retired.push(tool);
  } else if (postUrl) {
    summary.classifications.activePublished.push(tool);
  } else {
    summary.classifications.pending.push(tool);
  }
}

for (const values of Object.values(summary.classifications)) values.sort();
finishCheck('manifests', {
  total: manifests.size,
  activePublished: summary.classifications.activePublished.length,
  pending: summary.classifications.pending.length,
  retired: summary.classifications.retired.length,
});

const activePublished = summary.classifications.activePublished.map((tool) => manifests.get(tool)).filter(Boolean);
const pending = summary.classifications.pending.map((tool) => manifests.get(tool)).filter(Boolean);
const retired = summary.classifications.retired.map((tool) => manifests.get(tool)).filter(Boolean);

const catalogPath = path.join(outputsDir, 'tools.json');
const catalog = await readJson(catalogPath, 'catalog', 'outputs/tools.json');
let catalogItems = [];
if (catalog) {
  if (!Array.isArray(catalog.tools)) {
    fail('catalog', 'outputs/tools.json', 'tools must be an array');
  } else {
    catalogItems = catalog.tools;
  }
}

const expectedCatalogTools = new Set(toolNames(activePublished));
const actualCatalogTools = new Set();
for (const item of catalogItems) {
  const tool = typeof item?.tool === 'string' ? item.tool.trim() : '';
  if (!tool) {
    fail('catalog', 'outputs/tools.json', 'Every catalog item must have a tool identifier');
    continue;
  }
  if (actualCatalogTools.has(tool)) fail('catalog', tool, 'Duplicate catalog entry');
  actualCatalogTools.add(tool);

  const manifest = manifests.get(tool);
  if (!expectedCatalogTools.has(tool)) {
    fail('catalog', tool, 'Catalog contains a pending, retired, or unknown tool');
  }
  if (manifest && item.postUrl !== manifest.postUrl) {
    fail('catalog', tool, 'Catalog postUrl does not match versions.json');
  }
  if (manifest && item.version !== manifest.latestVersion) {
    fail('catalog', tool, 'Catalog version does not match latestVersion');
  }
}
for (const tool of expectedCatalogTools) {
  if (!actualCatalogTools.has(tool)) fail('catalog', tool, 'Active published tool is missing from outputs/tools.json');
}
finishCheck('catalog', {
  expected: [...expectedCatalogTools].sort(),
  actual: [...actualCatalogTools].sort(),
  pendingExcluded: pending.every((item) => !actualCatalogTools.has(item.tool)),
  retiredExcluded: retired.every((item) => !actualCatalogTools.has(item.tool)),
});

const retiredResults = [];
for (const item of retired) {
  const result = {
    tool: item.tool,
    replacementTool: item.replacementTool,
    hasPostUrl: validPublicUrl(item.postUrl),
    hasRetiredClass: false,
  };
  if (!item.postUrl) {
    fail('retiredPosts', item.tool, 'Retired tool must preserve a public postUrl');
  } else if (!validPublicUrl(item.postUrl)) {
    fail('retiredPosts', item.tool, `Retired tool has an invalid postUrl: ${item.postUrl}`);
  }

  const replacement = manifests.get(item.replacementTool);
  if (!item.replacementTool) {
    fail('retiredPosts', item.tool, 'replacementTool is required');
  } else if (!replacement) {
    fail('retiredPosts', item.tool, `Replacement manifest not found: ${item.replacementTool}`);
  } else if (replacement.status === 'retired' || !replacement.postUrl) {
    fail('retiredPosts', item.tool, `Replacement must be an active published tool: ${item.replacementTool}`);
  }

  const postPath = path.join(root, 'toolbox', 'posts', `${item.tool}.html`);
  const html = await readText(postPath, 'retiredPosts', item.tool);
  if (html !== null) {
    result.hasRetiredClass = [...html.matchAll(/<article\b[^>]*>/gi)]
      .some((match) => classIncludes(parseAttributes(match[0]), 'tb-retired-post'));
    if (!result.hasRetiredClass) {
      fail('retiredPosts', item.tool, 'Compatibility post must mark its article with .tb-retired-post');
    }
  }
  retiredResults.push(result);
}
finishCheck('retiredPosts', {
  checked: retiredResults.length,
  items: retiredResults,
});

const contentResults = [];
const contentMarkers = {
  details: ['<!-- tb-tool-details:start -->', '<!-- tb-tool-details:end -->'],
  faq: ['<!-- tb-faq:start -->', '<!-- tb-faq:end -->'],
  examples: ['<!-- tb-worked-examples:start -->', '<!-- tb-worked-examples:end -->'],
  limits: ['<!-- tb-result-guide:start -->', '<!-- tb-result-guide:end -->'],
};

for (const item of activePublished) {
  const postPath = path.join(root, 'toolbox', 'posts', `${item.tool}.html`);
  const html = await readText(postPath, 'activeContent', item.tool);
  const counts = {
    tool: item.tool,
    detailParagraphs: 0,
    faqItems: 0,
    workedExamples: 0,
    resultGuideItems: 0,
  };
  if (html !== null) {
    const details = markedSection(html, ...contentMarkers.details);
    const faq = markedSection(html, ...contentMarkers.faq);
    const examples = markedSection(html, ...contentMarkers.examples);
    const limits = markedSection(html, ...contentMarkers.limits);

    if (details === null || !/<section\b[^>]*class=["'][^"']*\btb-tool-details\b/i.test(details)) {
      fail('activeContent', item.tool, 'Generated detail section and markers are required');
    } else {
      counts.detailParagraphs = countMatches(details, /<p\b[^>]*>/gi);
    }
    if (faq === null) {
      fail('activeContent', item.tool, 'Generated FAQ markers are required');
    } else {
      counts.faqItems = countMatches(faq, /<details\b[^>]*>/gi);
    }
    if (examples === null || !/<section\b[^>]*class=["'][^"']*\btb-worked-examples\b/i.test(examples)) {
      fail('activeContent', item.tool, 'Generated .tb-worked-examples section and markers are required');
    } else {
      counts.workedExamples = countMatches(examples, /class=["'][^"']*\btb-example-card\b[^"']*["']/gi);
    }
    if (limits === null || !/<section\b[^>]*class=["'][^"']*\btb-result-guide\b/i.test(limits)) {
      fail('activeContent', item.tool, 'Generated .tb-result-guide section and markers are required');
    } else {
      counts.resultGuideItems = countMatches(limits, /<li\b[^>]*>/gi);
    }

    if (counts.detailParagraphs < 2) {
      fail('activeContent', item.tool, `At least 2 detail paragraphs are required; found ${counts.detailParagraphs}`);
    }
    if (counts.faqItems < 4) {
      fail('activeContent', item.tool, `At least 4 FAQ items are required; found ${counts.faqItems}`);
    }
    if (counts.workedExamples < 2) {
      fail('activeContent', item.tool, `At least 2 worked examples are required; found ${counts.workedExamples}`);
    }
    if (counts.resultGuideItems < 2) {
      fail('activeContent', item.tool, `At least 2 result-limit guide items are required; found ${counts.resultGuideItems}`);
    }
  }
  contentResults.push(counts);
}
finishCheck('activeContent', {
  checked: contentResults.length,
  minimums: {
    detailParagraphs: 2,
    faqItems: 4,
    workedExamples: 2,
    resultGuideItems: 2,
  },
  items: contentResults,
});

const pageFiles = ['about.html', 'contact.html', 'privacy-policy.html'];
const pageResults = [];
for (const file of pageFiles) {
  const filePath = path.join(root, 'toolbox', 'pages', file);
  const html = await readText(filePath, 'staticPages', file);
  const result = {
    file,
    exists: html !== null,
    nonEmpty: Boolean(html?.trim()),
    placeholders: html ? [...new Set([...html.matchAll(/\{\{([^{}]+)\}\}/g)].map((match) => match[1]))].sort() : [],
  };
  if (html !== null && !html.trim()) fail('staticPages', file, 'Static page must not be empty');
  pageResults.push(result);
}
finishCheck('staticPages', {
  checked: pageResults.length,
  placeholdersAllowedBeforePublish: true,
  items: pageResults,
});

const siteScriptPath = path.join(root, 'assets', 'blogger', 'site.js');
const siteScript = await readText(siteScriptPath, 'siteScript', 'assets/blogger/site.js');
if (siteScript !== null) {
  const legalNavigationChecks = [
    ['legalLinks source', /config\.legalLinks/],
    ['legal navigation renderer', /function\s+renderLegalNavigation\s*\(/],
    ['legal navigation class', /ow-legal-nav/],
    ['legal renderer invocation', /renderLegalNavigation\s*\(\s*config\s*\)/],
  ];
  const retiredNoindexChecks = [
    ['retired post selector', /\.tb-retired-post/],
    ['retired marker function', /function\s+markRetiredPost\s*\(/],
    ['robots meta handling', /meta\[name=["']robots["']\]/],
    ['noindex,follow policy', /noindex\s*,\s*follow/i],
    ['retired marker invocation', /markRetiredPost\s*\(\s*\)/],
  ];
  for (const [label, pattern] of [...legalNavigationChecks, ...retiredNoindexChecks]) {
    if (!pattern.test(siteScript)) fail('siteScript', label, `Missing ${label} implementation`);
  }
}
finishCheck('siteScript', {
  file: relative(siteScriptPath),
  legalNavigation: true,
  retiredNoindex: true,
});

const postStylesPath = path.join(root, 'assets', 'blogger', 'theme.css');
const postStyles = await readText(postStylesPath, 'postStyles', 'assets/blogger/theme.css');
if (postStyles !== null) {
  for (const [label, pattern] of [
    ['worked example grid', /\.tb-post\s+\.tb-worked-example-list\s*\{[^}]*display:\s*grid/i],
    ['worked example card', /\.tb-post\s+\.tb-example-card\s*\{/i],
    ['long example wrapping', /\.tb-post\s+\.tb-example-card\s+dd\s*\{[^}]*overflow-wrap:\s*anywhere[^}]*white-space:\s*pre-wrap/i],
    ['result guide', /\.tb-post\s+\.tb-result-guide\s+ul\s*\{/i],
    ['mobile one-column examples', /@media\s*\(max-width:\s*560px\)[\s\S]*?\.tb-post\s+\.tb-worked-example-list\s*\{[^}]*grid-template-columns:\s*1fr/i],
  ]) {
    if (!pattern.test(postStyles)) fail('postStyles', label, `Missing ${label} rule`);
  }
}
finishCheck('postStyles', {
  file: relative(postStylesPath),
  responsiveBreakpoint: '560px',
});

const themePath = path.join(root, 'toolbox', 'theme', 'openworld-toolbox-upload.xml');
const theme = await readText(themePath, 'theme', 'toolbox/theme/openworld-toolbox-upload.xml');
let retiredFilterCount = 0;
let retiredNoindexConditionCount = 0;
let forbiddenWidgets = [];
let inlineAdsDisabled = false;
if (theme !== null) {
  retiredFilterCount = countMatches(theme, /p\.labels none \(l => l\.name == &quot;toolbox-retired&quot;\)/g);
  if (retiredFilterCount !== 2) {
    fail('theme', 'retired filters', `Exactly 2 retired-post list filters are required; found ${retiredFilterCount}`);
  }
  retiredNoindexConditionCount = countMatches(theme, /data:post\.labels any \(label => label\.name == &quot;toolbox-retired&quot;\)/g);
  const retiredRobotsMetaCount = countMatches(theme, /<meta content='noindex,follow' name='robots'\/>/g);
  if (retiredNoindexConditionCount !== 2 || retiredRobotsMetaCount !== 2) {
    fail('theme', 'retired noindex', `Exactly 2 retired-post noindex conditions and meta tags are required; found ${retiredNoindexConditionCount} conditions and ${retiredRobotsMetaCount} tags`);
  }

  inlineAdsDisabled = /<b:widget-setting\b[^>]*name=(["'])showInlineAds\1[^>]*>\s*false\s*<\/b:widget-setting>/i.test(theme);
  if (!inlineAdsDisabled) fail('theme', 'showInlineAds', 'showInlineAds must remain false');

  for (const match of theme.matchAll(/<b:widget\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const type = String(attributes.type || '').toLowerCase();
    const id = String(attributes.id || '');
    if (type === 'adsense' || type === 'featuredpost' || type === 'popularposts'
      || /^(?:AdSense|FeaturedPost|PopularPosts)/i.test(id)) {
      forbiddenWidgets.push({ id, type: attributes.type || '' });
    }
  }
  if (forbiddenWidgets.length) {
    fail('theme', 'approval-blocking widgets', 'AdSense, FeaturedPost, and PopularPosts widgets must be absent', forbiddenWidgets);
  }
  if (/data:post\.includeAd|<data:adCode\s*\/>/.test(theme)) {
    fail('theme', 'inline ad rendering', 'Inline ad rendering must be absent during approval remediation');
  }
}
finishCheck('theme', {
  file: relative(themePath),
  retiredFilterCount,
  retiredNoindexConditionCount,
  inlineAdsDisabled,
  forbiddenWidgets,
});

function expectedCanonical(item) {
  if (!item) return '';
  if (item.status === 'retired') return manifests.get(item.replacementTool)?.postUrl || '';
  return item.postUrl || '';
}

async function validateIndexing(filePath, expected, subject) {
  const html = await readText(filePath, 'indexing', subject);
  if (html === null) return { subject, robots: 0, canonicals: [], expectedCanonical: expected };

  const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => parseAttributes(match[0]))
    .filter((attributes) => String(attributes.name || '').toLowerCase() === 'robots');
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => parseAttributes(match[0]))
    .filter((attributes) => String(attributes.rel || '').toLowerCase().split(/\s+/).includes('canonical'))
    .map((attributes) => attributes.href || '');

  if (robots.length !== 1) {
    fail('indexing', subject, `Exactly 1 robots meta is required; found ${robots.length}`);
  } else {
    const directives = String(robots[0].content || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (!directives.includes('noindex') || !directives.includes('follow') || directives.includes('nofollow')) {
      fail('indexing', subject, `Robots policy must be noindex,follow; found "${robots[0].content || ''}"`);
    }
  }

  if (expected) {
    if (canonicals.length !== 1 || canonicals[0] !== expected) {
      fail('indexing', subject, `Canonical must be "${expected}"`, { found: canonicals });
    }
  } else if (canonicals.length) {
    fail('indexing', subject, 'Pending execution pages must not claim a canonical URL', { found: canonicals });
  }

  return {
    subject,
    robots: robots.length,
    canonicals,
    expectedCanonical: expected,
  };
}

let embedEntries = [];
try {
  embedEntries = (await fs.readdir(path.join(root, 'embed'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
} catch (error) {
  fail('indexing', 'embed', `Cannot list embed directory: ${error.message}`);
}

const embedSet = new Set(embedEntries);
for (const tool of manifests.keys()) {
  if (!embedSet.has(tool)) fail('indexing', tool, 'Manifest has no matching embed directory');
}
for (const tool of embedEntries) {
  if (!manifests.has(tool)) fail('indexing', tool, 'Embed directory has no matching versions.json manifest');
}

const indexingResults = [];
for (const tool of embedEntries) {
  const item = manifests.get(tool);
  indexingResults.push(await validateIndexing(
    path.join(root, 'embed', tool, 'index.html'),
    expectedCanonical(item),
    `embed/${tool}/index.html`,
  ));
}
const rootCanonical = manifests.get('qr-barcode-generator')?.postUrl || '';
indexingResults.push(await validateIndexing(path.join(root, 'index.html'), rootCanonical, 'index.html'));
finishCheck('indexing', {
  checked: indexingResults.length,
  embedDirectories: embedEntries.length,
  manifests: manifests.size,
  items: indexingResults,
});

const workflowPath = path.join(root, '.github', 'workflows', 'deploy-pages.yml');
const artifactScriptPath = path.join(root, 'scripts', 'prepare-pages-artifact.mjs');
const workflow = await readText(workflowPath, 'deployment', '.github/workflows/deploy-pages.yml');
const artifactScript = await readText(artifactScriptPath, 'deployment', 'scripts/prepare-pages-artifact.mjs');
if (workflow !== null) {
  for (const [label, pattern] of [
    ['indexing validation', /validate-public-indexing\.mjs/],
    ['curated artifact preparation', /prepare-pages-artifact\.mjs/],
    ['Pages artifact upload', /actions\/upload-pages-artifact@/],
    ['Pages deployment', /actions\/deploy-pages@/],
  ]) {
    if (!pattern.test(workflow)) fail('deployment', label, `Pages workflow is missing ${label}`);
  }
}
if (artifactScript !== null) {
  for (const requiredEntry of ['assets', 'embed', 'index.html', 'outputs', 'site.json', 'tools.json']) {
    if (!artifactScript.includes(`'${requiredEntry}'`) && !artifactScript.includes(`"${requiredEntry}"`)) {
      fail('deployment', requiredEntry, `Curated artifact script does not include ${requiredEntry}`);
    }
  }
  if (/fs\.cp\s*\(\s*root\b/.test(artifactScript)) {
    fail('deployment', 'artifact scope', 'Curated artifact script must not copy the repository root wholesale');
  }
  if (!/if\s*\(\s*!manifest\.postUrl\s*\)\s*continue/.test(artifactScript)) {
    fail('deployment', 'pending embed exclusion', 'Curated artifact script must exclude execution pages without a public postUrl');
  }
  if (/['"]ai-index\.json['"]/.test(artifactScript)) {
    fail('deployment', 'internal AI index', 'Curated artifact script must not publish the internal AI routing index');
  }
}
finishCheck('deployment', {
  workflow: relative(workflowPath),
  artifactScript: relative(artifactScriptPath),
});

if (publicMode) {
  const publicCheck = {
    enabled: true,
    requested: 0,
    passed: 0,
    failed: 0,
    contentChecked: 0,
    failures: [],
    warnings: [],
  };
  const requests = new Map();

  function addPublicUrl(url, kind, subject) {
    if (!validPublicUrl(url)) {
      fail('publicHttp', subject, `Public URL is missing or invalid: ${url || '(empty)'}`);
      return;
    }
    const existing = requests.get(url);
    if (existing) {
      existing.kinds.add(kind);
      existing.subjects.add(subject);
    } else {
      requests.set(url, { url, kinds: new Set([kind]), subjects: new Set([subject]) });
    }
  }

  const githubRoot = 'https://leedohon.github.io/toolbox-project/';
  addPublicUrl('https://bloggiedh.blogspot.com/', 'blogger-home', 'Blogger home');
  addPublicUrl(githubRoot, 'github-root', 'GitHub Pages root');
  const deployedTools = new Set([...activePublished, ...retired].map((item) => item.tool));
  for (const tool of embedEntries.filter((item) => deployedTools.has(item))) {
    addPublicUrl(new URL(`embed/${encodeURIComponent(tool)}/`, githubRoot).toString(), 'embed', tool);
  }
  for (const item of [...activePublished, ...retired]) addPublicUrl(item.postUrl, 'blogger-post', item.tool);

  const siteConfig = await readJson(path.join(outputsDir, 'site.json'), 'publicHttp', 'outputs/site.json');
  const legalLinks = Array.isArray(siteConfig?.legalLinks) ? siteConfig.legalLinks : [];
  const requiredLegalKeys = ['about', 'contact', 'privacy'];
  for (const key of requiredLegalKeys) {
    const link = legalLinks.find((item) => item?.key === key);
    if (!link) {
      fail('publicHttp', `legal page: ${key}`, 'Published legal page URL is missing from outputs/site.json');
    } else {
      addPublicUrl(link.url, 'legal-page', `legal page: ${key}`);
    }
  }

  const queue = [...requests.values()];
  publicCheck.requested = queue.length;
  let nextIndex = 0;

  async function fetchPublicPage(url) {
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      try {
        return await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: controller.signal,
          headers: {
            accept: 'text/html,application/json;q=0.8,*/*;q=0.5',
            'user-agent': 'Toolbox-Monetization-Readiness-Audit/1.0',
          },
        });
      } catch (error) {
        lastError = error;
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 750));
      } finally {
        clearTimeout(timeout);
      }
    }
    throw lastError;
  }

  async function inspectPublicUrl(request) {
    try {
      const response = await fetchPublicPage(request.url);
      if (!response.ok) {
        await response.body?.cancel();
        const message = `HTTP ${response.status} ${response.statusText || ''}`.trim();
        fail('publicHttp', request.url, message, {
          category: 'http',
          kinds: [...request.kinds].sort(),
          subjects: [...request.subjects].sort(),
        });
        publicCheck.failures.push({ url: request.url, category: 'http', message });
        publicCheck.failed += 1;
        return;
      }

      const inspectContent = ['blogger-home', 'blogger-post', 'legal-page']
        .some((kind) => request.kinds.has(kind));
      let contentFailure = false;
      if (inspectContent) {
        const html = await response.text();
        publicCheck.contentChecked += 1;
        const contentProblems = [];
        const bloggerAutoAdsFlag = /['"]adsenseAutoAds['"]\s*:\s*true/i.test(html);
        const explicitAdSlots = [
          ...html.matchAll(/<ins\b[^>]*class=(?:['"])[^'"]*\badsbygoogle\b[^'"]*(?:['"])/gi),
          ...html.matchAll(/\bdata-ad-slot\s*=/gi),
        ].length;
        if (bloggerAutoAdsFlag && explicitAdSlots) {
          contentProblems.push('Blogger automatic ads are enabled with explicit ad slots');
        } else if (bloggerAutoAdsFlag) {
          publicCheck.warnings.push({
            url: request.url,
            code: 'BLOGGER_ADSENSE_METADATA_STALE',
            message: 'Blogger source reports adsenseAutoAds=true, but no explicit ad slot is present; verify the authoritative AdSense/Blogger control remains off.',
          });
        }
        const forbiddenPublicWidgets = [...html.matchAll(/\bid=(?:['"])(AdSense\d+|FeaturedPost\d+|PopularPosts\d+)(?:['"])/gi)]
          .map((match) => match[1]);
        if (forbiddenPublicWidgets.length) {
          contentProblems.push(`Forbidden Blogger widgets remain: ${[...new Set(forbiddenPublicWidgets)].join(', ')}`);
        }

        const retiredSubjects = [...request.subjects]
          .filter((subject) => manifests.get(subject)?.status === 'retired');
        if (retiredSubjects.length) {
          if (!/class=(?:['"])[^'"]*\btb-retired-post\b[^'"]*(?:['"])/i.test(html)) {
            contentProblems.push('Retired compatibility marker is missing');
          }
          if (!/<meta\b[^>]*name=(?:['"])robots(?:['"])[^>]*content=(?:['"])noindex\s*,\s*follow(?:['"])/i.test(html)
            && !/<meta\b[^>]*content=(?:['"])noindex\s*,\s*follow(?:['"])[^>]*name=(?:['"])robots(?:['"])/i.test(html)) {
            contentProblems.push('Retired post noindex,follow policy is missing');
          }
        }

        if (contentProblems.length) {
          contentFailure = true;
          const message = contentProblems.join('; ');
          fail('publicHttp', request.url, message, {
            category: 'content',
            kinds: [...request.kinds].sort(),
            subjects: [...request.subjects].sort(),
          });
          publicCheck.failures.push({ url: request.url, category: 'content', message });
        }
      } else {
        await response.body?.cancel();
      }

      if (contentFailure) publicCheck.failed += 1;
      else publicCheck.passed += 1;
    } catch (error) {
      const cause = error?.cause?.code || error?.cause?.message || error?.message || String(error);
      const category = error?.name === 'AbortError' ? 'timeout' : 'network';
      const message = category === 'timeout'
        ? 'Network timeout after two 20000ms attempts'
        : `Network error: ${cause}`;
      fail('publicHttp', request.url, message, {
        category,
        kinds: [...request.kinds].sort(),
        subjects: [...request.subjects].sort(),
      });
      publicCheck.failures.push({ url: request.url, category, message });
      publicCheck.failed += 1;
    }
  }

  async function worker() {
    while (nextIndex < queue.length) {
      const index = nextIndex;
      nextIndex += 1;
      await inspectPublicUrl(queue[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(10, queue.length) }, () => worker()));
  publicCheck.warningCount = publicCheck.warnings.length;
  finishCheck('publicHttp', publicCheck);
} else {
  finishCheck('publicHttp', {
    enabled: false,
    note: 'Run with --public to verify deployed URLs over HTTP.',
  });
}

summary.ok = errors.length === 0;
summary.errorCount = errors.length;
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!summary.ok) process.exitCode = 1;
