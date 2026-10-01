#!/usr/bin/env node
/**
 * Per-book EPUB export.
 *
 * Requires a production build first (`npm run build`) and pandoc. Reuses the
 * preview server to extract each book's rendered article HTML, rewrites image
 * URLs to local file paths so pandoc embeds them, and produces
 * dist-epub/grommunio-<book>.epub (also copied to dist/epub/).
 *
 * Usage: node scripts/gen-epub.mjs [book ...]   (default: all books)
 */
import { launchChromium } from './lib/browser.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOK_TITLES, pagesFor, withPreview } from './lib/site.mjs';
import { DOC_VERSION as VERSION, DOC_DATE } from '../src/version.mjs';

// pandoc only accepts an ISO-8601 date for dc:date — given anything else (such
// as our dotted calendar version) it silently writes an *empty* <dc:date>.
const ISO_DATE = DOC_DATE.slice(0, 10);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const IMG = path.join(ROOT, 'public/img');
// public/ so the files are bundled into dist/ on every build; mirror into the
// current dist/ for an already-running preview.
const OUT = path.join(ROOT, 'public/epub');
const DIST_EPUB = path.join(ROOT, 'dist/epub');

const wanted = process.argv.slice(2).filter((a) => BOOK_TITLES[a]);
const books = wanted.length ? wanted : Object.keys(BOOK_TITLES);

fs.mkdirSync(OUT, { recursive: true });
const haveDist = fs.existsSync(path.join(ROOT, 'dist'));
if (haveDist) fs.mkdirSync(DIST_EPUB, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gx-epub-'));

await withPreview(ROOT, async (BASE) => {
  const browser = await launchChromium();
  const page = await browser.newPage();
  for (const book of books) {
    const pages = pagesFor(book, DOCS);
    const parts = [];
    for (const p of pages) {
      try {
        await page.goto(BASE + p.slug, { waitUntil: 'networkidle', timeout: 45000 });
        let html = await page.$eval('.sl-markdown-content', (el) => el.innerHTML).catch(() => null);
        if (!html) continue;
        // keep only the light diagram variant; embed images from the local
        // filesystem; drop anchor-link cruft
        html = html
          .replace(/<img\b[^>]*\bfor-dark\b[^>]*>/g, '')
          .replace(/\s(?:src|href)="\/img\//g, (m) => m.replace('/img/', IMG + '/'))
          // point remaining in-site links at the production site (root-relative
          // hrefs are dead in an e-reader otherwise)
          .replace(/href="\/(?!\/)/g, `href="${process.env.SITE_URL || 'https://docs.grommunio.com'}/`)
          .replace(/<a\b[^>]*class="[^"]*sl-anchor-link[^"]*"[^>]*>[\s\S]*?<\/a>/g, '');
        parts.push(`<h1>${p.title}</h1>\n${html}`);
      } catch (e) {
        console.error(`  ! ${p.slug}: ${e.message.split('\n')[0]}`);
      }
    }
    const htmlFile = path.join(tmp, `${book}.html`);
    fs.writeFileSync(htmlFile, `<!doctype html><html><head><meta charset="utf-8"><title>${BOOK_TITLES[book]}</title></head><body>${parts.join('\n')}</body></html>`);
    const epub = path.join(OUT, `grommunio-${book}.epub`);
    try {
      execFileSync('pandoc', [
        '-f', 'html', '-t', 'epub3', htmlFile, '-o', epub,
        '--toc', '--toc-depth=2',
        '--metadata', `title=${BOOK_TITLES[book]}`,
        '--metadata', 'author=grommunio GmbH',
        '--metadata', 'lang=en',
        '--metadata', `date=${ISO_DATE}`,
        // Version the identifier so a reader's library treats each build as a
        // distinct revision of the same book rather than a duplicate.
        '--metadata', `identifier=urn:grommunio:docs:${book}:${VERSION}`,
      ], { stdio: ['ignore', 'ignore', 'pipe'] });
      if (haveDist) fs.copyFileSync(epub, path.join(DIST_EPUB, `grommunio-${book}.epub`));
      console.log(`✓ ${book}: ${parts.length}/${pages.length} pages → grommunio-${book}.epub (${(fs.statSync(epub).size / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ! pandoc epub failed for ${book}: ${String(e.stderr || e.message).split('\n')[0]}`);
    }
  }
  await browser.close();
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log('Done → public/epub/ (bundled into every build; mirrored to dist/epub/)');
