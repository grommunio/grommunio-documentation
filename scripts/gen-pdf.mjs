#!/usr/bin/env node
/**
 * Branded per-book PDF export.
 *
 * Requires a production build first (`npm run build`). Spins up a local
 * `astro preview` server, walks each book's pages in sidebar order, extracts
 * the rendered article HTML, stitches it into one document with a branded
 * cover + print stylesheet, and prints it to dist-pdf/grommunio-<book>.pdf
 * (also copied into dist/pdf/ so the files are downloadable from the site).
 *
 * Usage: node scripts/gen-pdf.mjs [book ...]   (default: all books)
 */
import { launchChromium } from './lib/browser.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOK_TITLES, pagesFor, withPreview } from './lib/site.mjs';
import { DOC_VERSION as VERSION } from '../src/version.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'src/content/docs');
// Emit into public/ so `astro build` copies the files into dist/ on every
// build (survives `npm run serve`); also mirror into the current dist/ so a
// running preview serves them immediately without a rebuild.
const OUT = path.join(ROOT, 'public/pdf');
const DIST_PDF = path.join(ROOT, 'dist/pdf');

function shell(title, sections) {
  const css = `
    @font-face{font-family:"Noto Sans";src:url("/fonts/notosans-regular.woff2") format("woff2");font-weight:400}
    @font-face{font-family:"Noto Sans";src:url("/fonts/notosans-semibold.woff2") format("woff2");font-weight:600}
    @font-face{font-family:"Noto Sans";src:url("/fonts/notosans-bold.woff2") format("woff2");font-weight:700}
    *{box-sizing:border-box}
    .sl-anchor-link,a.sl-anchor-link{display:none!important}
    .sr-only,.visually-hidden{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}
    body{font-family:"Noto Sans",system-ui,sans-serif;color:#16233a;line-height:1.6;font-size:10.5pt;margin:0}
    h1,h2,h3,h4{color:#0c1625;font-weight:600;line-height:1.2;margin:1.4em 0 .5em;break-after:avoid}
    h1{font-size:20pt;color:#007fc0;border-bottom:2px solid #009fe3;padding-bottom:.25em}
    h2{font-size:15pt}h3{font-size:12.5pt}h4{font-size:11pt}
    a{color:#0369a1;text-decoration:none}
    code{font-family:ui-monospace,"Cascadia Code",monospace;font-size:9pt;background:#eef2f8;padding:.1em .35em;border-radius:3px;border:1px solid #d4dcea}
    /* light code blocks for print (Expressive Code uses its light theme via the
       data-theme="light" on <html>; this styles the frame + any bare <pre>) */
    pre{background:#f3f6fb;color:#16233a;padding:.8em 1em;border-radius:6px;overflow-x:auto;font-size:8.5pt;break-inside:avoid;border:1px solid #d4dcea}
    pre code{background:none;border:none;color:inherit;padding:0}
    .expressive-code .frame pre{background:#f6f8fb}
    .expressive-code{--ec-frm-edBg:#f6f8fb;--ec-frm-edTabBarBg:#eef2f8;--ec-frm-frameBoxShdCssVal:none}
    .expressive-code .frame .header,.expressive-code figcaption{color:#46587a}
    img{max-width:100%;height:auto;border:1px solid #d4dcea;border-radius:6px}
    table{border-collapse:collapse;width:100%;font-size:9pt;margin:1em 0}
    th,td{border:1px solid #d4dcea;padding:.4em .6em;text-align:left;vertical-align:top}
    th{background:#eef2f8}
    tbody tr:nth-child(even){background:#f6f8fb}
    h2{border-bottom:1px solid #d4dcea;padding-bottom:.2em}
    p:has(> dfn.gx-param:first-child){margin-top:.9em;padding-left:.7em;border-left:2px solid #9bdbd3}
    .starlight-aside{border-left:4px solid #009fe3;background:#f0f8ff;padding:.6em 1em;margin:1em 0;border-radius:0 6px 6px 0;break-inside:avoid}
    .starlight-aside--caution{border-left-color:#d8932c;background:#fdf6ec}
    .starlight-aside--danger{border-left-color:#d8423c;background:#fdeceb}
    .starlight-aside__title{font-weight:700;margin-bottom:.3em}
    /* config parameters */
    dfn.gx-param{font-family:ui-monospace,monospace;font-style:normal;font-weight:600;font-size:.9em;color:#0b7d72;background:#e6faf7;border:1px solid #b9e8e2;border-radius:4px;padding:.05em .4em}
    /* architecture diagram */
    .gx-arch{border:1px solid #d4dcea;border-radius:10px;padding:1rem;margin:1.2em 0;break-inside:avoid;background:#f7fafd}
    .gx-arch figcaption{font-weight:600;margin-bottom:.6em}
    .gx-arch__layer{display:grid;grid-template-columns:8rem 1fr;gap:.5rem;padding:.4rem 0;align-items:center}
    .gx-arch__layer+.gx-arch__layer{border-top:1px dashed #d4dcea}
    .gx-arch__name{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#46587a;border-left:3px solid #009fe3;padding-left:.5rem}
    .gx-arch__chips{display:flex;flex-wrap:wrap;gap:.3rem}
    .gx-arch__chip{font-size:8pt;padding:.2em .5em;border-radius:5px;border:1px solid #cdd8e8;background:#fff}
    .gx-arch__chip[data-kind='gx']{color:#075783;background:#eaf6fd;border-color:#9fd3f2}
    .gx-arch__appliance{border:1px solid #9fd3f2;border-radius:8px;padding:.3rem .8rem;margin:.4rem 0;position:relative}
    .gx-arch__badge{font-size:7pt;font-weight:700;text-transform:uppercase;color:#075783;border:1px solid #9fd3f2;border-radius:999px;padding:.1em .5em;position:absolute;right:.8rem;top:-.6rem;background:#f7fafd}
    .gx-arch__legend{display:flex;gap:1.2rem;margin-top:.8rem;padding-top:.6rem;border-top:1px solid #d4dcea;font-size:8pt;color:#46587a}
    .gx-arch__legend span{display:inline-flex;align-items:center;gap:.4rem}
    .gx-arch__key{width:.8rem;height:.8rem;border-radius:3px;border:1px solid #cdd8e8;display:inline-block}
    .gx-arch__key[data-kind='gx']{background:#cdeafb;border-color:#9fd3f2}
    /* Starlight <CardGrid>/<LinkCard> (book overview pages): stack the cards
       as bordered blocks instead of the flattened "TitleDescription →" run-on */
    .card-grid{display:block}
    .sl-link-card{display:block;border:1px solid #d4dcea;border-radius:6px;padding:.5em .8em;margin:.5em 0;break-inside:avoid}
    .sl-link-card .title{display:block;font-weight:600;color:#0369a1}
    .sl-link-card .description{display:block;color:#46587a;font-size:9.5pt;margin-top:.15em}
    .sl-link-card svg,.sl-link-card .icon{display:none}
    /* themed diagrams: use the light SVG variant on the white page */
    .gx-diagram{border:1px solid #d4dcea;border-radius:10px;padding:.8rem;margin:1.2em 0;background:#f7fafd;break-inside:avoid;text-align:center}
    .gx-diagram .for-dark{display:none!important}
    .gx-diagram .for-light{display:inline-block!important}
    .gx-diagram img{max-width:100%;height:auto}
    .gx-diagram figcaption{font-size:8pt;color:#46587a;margin-top:.5em}
    section.pdf-page{break-before:page}
    .cover{break-after:page;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 4rem}
    .cover img{width:280px;border:none}
    .cover h1{font-size:30pt;border:none;color:#0c1625;margin:.6em 0 .2em}
    .cover .sub{font-size:13pt;color:#46587a}
    .cover .ver{margin-top:2rem;font-size:10pt;color:#7589ab}
  `;
  // Chrome copies <title>/<meta author> into the PDF's document properties —
  // without them the exports open as an untitled document in every reader.
  return `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>${title} — ${VERSION}</title><meta name="author" content="grommunio GmbH"><meta name="description" content="${title}, grommunio documentation ${VERSION}."><style>${css}</style></head><body>
  <div class="cover">
    <img src="/brand/grommunio-logo-dark.svg" alt="grommunio"/>
    <h1>${title}</h1><div class="sub">Official documentation</div>
    <div class="ver">Version ${VERSION} · docs.grommunio.com</div>
  </div>
  ${sections}
  </body></html>`;
}

const wanted = process.argv.slice(2).filter((a) => BOOK_TITLES[a]);
const books = wanted.length ? wanted : Object.keys(BOOK_TITLES);

fs.mkdirSync(OUT, { recursive: true });
const haveDist = fs.existsSync(path.join(ROOT, 'dist'));
if (haveDist) fs.mkdirSync(DIST_PDF, { recursive: true });

await withPreview(ROOT, async (BASE) => {
  const browser = await launchChromium();
  const page = await browser.newPage();
  for (const book of books) {
    const pages = pagesFor(book, DOCS);
    const parts = [];
    for (const p of pages) {
      try {
        await page.goto(BASE + p.slug, { waitUntil: 'networkidle', timeout: 45000 });
        const html = await page.$eval('.sl-markdown-content', (el) => el.innerHTML).catch(() => null);
        if (html) parts.push(`<section class="pdf-page"><h1>${p.title}</h1>${html}</section>`);
      } catch (e) {
        console.error(`  ! ${p.slug}: ${e.message.split('\n')[0]}`);
      }
    }
    const render = await browser.newPage();
    await render.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    // Rewrite in-site links to the production domain so the clickable links in
    // the PDF point at docs.grommunio.com, not the localhost preview server.
    // (Images keep their root-relative src and load from the preview via baseURL.)
    const PROD = process.env.SITE_URL || 'https://docs.grommunio.com';
    const body = parts.join('\n').replace(/href="\/(?!\/)/g, `href="${PROD}/`);
    await render.setContent(shell(BOOK_TITLES[book], body), { waitUntil: 'networkidle', baseURL: BASE });
    const file = path.join(OUT, `grommunio-${book}.pdf`);
    await render.pdf({
      path: file, format: 'A4', printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:7pt;color:#7589ab;width:100%;padding:0 16mm;text-align:right;font-family:sans-serif">${BOOK_TITLES[book]}</div>`,
      footerTemplate: `<div style="font-size:7pt;color:#7589ab;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>© grommunio GmbH — CC BY-SA 4.0 or later</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    });
    await render.close();
    if (haveDist) fs.copyFileSync(file, path.join(DIST_PDF, `grommunio-${book}.pdf`));
    console.log(`✓ ${book}: ${parts.length}/${pages.length} pages → grommunio-${book}.pdf (${(fs.statSync(file).size / 1024).toFixed(0)} KB)`);
  }
  await browser.close();
});
console.log('Done → public/pdf/ (bundled into every build; mirrored to dist/pdf/)');
