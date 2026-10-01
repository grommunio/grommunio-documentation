#!/usr/bin/env node
/**
 * Internal link checker for the built site.
 *
 * Nothing previously verified that a site-absolute link resolved, so broken
 * targets shipped unnoticed: man-page links written with the upstream dotted
 * filename (`/man/gromox-mt2exm.8/`) rather than the slug the generator emits
 * (`/man/gromox-mt2exm-8/`), README-derived repo paths rendered as site paths
 * (`/build`, `/config.php`), and locale-prefixed URLs for routes that exist in
 * one language only.
 *
 * Runs over dist/ — the built output rather than the Markdown sources — so it
 * also covers links produced by components, redirects and generated pages, and
 * validates against the routes Astro really emitted.
 *
 * Usage: node scripts/check-links.mjs   (after `npm run build`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST)) {
  console.error('No dist/ — run `npm run build` first.');
  process.exit(2);
}

/** Every file in dist/, as a set of site-absolute paths. */
function walk(dir, out = new Set(), prefix = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = `${prefix}/${e.name}`;
    if (e.isDirectory()) walk(path.join(dir, e.name), out, rel);
    else out.add(rel);
  }
  return out;
}

const files = walk(DIST);

/** Does a site-absolute href resolve to something in dist/? */
function resolves(href) {
  const clean = href.replace(/[?#].*$/, '');
  if (files.has(clean)) return true;                       // exact file (asset)
  const noSlash = clean.replace(/\/$/, '');
  // build.format: 'directory' → /foo/ is emitted as /foo/index.html
  return files.has(`${noSlash}/index.html`) || files.has(`${noSlash}.html`) || noSlash === '';
}

// The book pages link the PDF/EPUB downloads, which only exist after
// `npm run pdf` / `npm run epub` (MAKE_PDF / MAKE_EPUB in ./deploy). When an
// export has not been built at all, its links are reported but not counted as
// broken; once any file of that export exists, every link to it is checked.
const EXPORTS = ['/pdf/', '/epub/'];
const exportBuilt = (prefix) => [...files].some((f) => f.startsWith(prefix));
const skippedExports = new Map(); // prefix -> count

const HREF = /\b(?:href|src)="(\/[^"]*)"/g;
const broken = new Map(); // target -> Set(pages)
let pagesScanned = 0;

for (const rel of files) {
  if (!rel.endsWith('.html')) continue;
  pagesScanned++;
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  for (const m of html.matchAll(HREF)) {
    const target = m[1];
    // Protocol-relative URLs are external.
    if (target.startsWith('//')) continue;
    if (resolves(target)) continue;
    const exp = EXPORTS.find((prefix) => target.startsWith(prefix));
    if (exp && !exportBuilt(exp)) {
      skippedExports.set(exp, (skippedExports.get(exp) || 0) + 1);
      continue;
    }
    if (!broken.has(target)) broken.set(target, new Set());
    broken.get(target).add(rel);
  }
}

if (pagesScanned === 0) {
  // An empty dist/ (e.g. after a failed build that had already cleared the
  // directory) must not pass as "no broken links".
  console.error('✗ links: no HTML pages found in dist/ — run `npm run build` first.');
  process.exit(2);
}

for (const [prefix, n] of skippedExports) {
  console.warn(`! links: ${n} link(s) to ${prefix} not checked — that export has not been built`);
}

if (broken.size === 0) {
  console.log(`✓ links: no broken internal targets (${pagesScanned} pages scanned)`);
  process.exit(0);
}

// Sort by blast radius: the targets referenced from the most pages first.
const sorted = [...broken.entries()].sort((a, b) => b[1].size - a[1].size);
let total = 0;
console.error(`✗ links: ${broken.size} broken internal target(s) across ${pagesScanned} pages\n`);
for (const [target, pages] of sorted) {
  total += pages.size;
  const sample = [...pages].slice(0, 3).map((p) => `      ${p}`).join('\n');
  console.error(`  ${target}  (${pages.size} occurrence${pages.size > 1 ? 's' : ''})\n${sample}` +
    (pages.size > 3 ? `\n      … and ${pages.size - 3} more` : ''));
}
console.error(`\n${total} broken link occurrence(s).`);
process.exit(1);
