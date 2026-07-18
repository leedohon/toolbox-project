import fs from 'node:fs/promises';

const files = process.argv.slice(2);
if (!files.length) throw new Error('Usage: node scripts/validate-inline-scripts.mjs <html...>');

for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [, attributes, source] of scripts) {
    const parsable = /\btype=["']module["']/.test(attributes)
      ? source.replace(/^\s*import\s+[^;]+;/gm, '')
      : source;
    if (/\btype=["']module["']/.test(attributes)) Function(`return (async () => {${parsable}\n});`);
    else Function(parsable);
  }
  console.log(`${file}: ${scripts.length} inline scripts parsed`);
}
