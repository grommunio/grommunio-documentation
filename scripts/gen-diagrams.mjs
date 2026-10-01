#!/usr/bin/env node
/**
 * Render the brand-themed architecture diagrams.
 *
 * Each scripts/diagrams/<name>.mmd (Mermaid) is rendered to two static SVGs —
 * public/img/arch/<name>-dark.svg and <name>-light.svg — using a headless
 * Chromium + the bundled mermaid library. The <Diagram> component swaps between
 * them by theme. Static SVGs mean no markdown-pipeline/Expressive-Code conflict
 * and they render correctly in the HTML site, the PDFs and the EPUBs.
 *
 * Usage: node scripts/gen-diagrams.mjs [name ...]   (default: all)
 */
import { launchChromium } from './lib/browser.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(HERE, 'diagrams');
const OUT = path.join(ROOT, 'public/img/arch');
const MERMAID = path.join(ROOT, 'node_modules/mermaid/dist/mermaid.min.js');

const base = {
  fontFamily: '"Noto Sans", system-ui, sans-serif',
  background: 'transparent',
  primaryColor: '#11243a',
  primaryBorderColor: '#29b3f6',
  primaryTextColor: '#eef2f8',
  lineColor: '#7589ab',
  textColor: '#d4dcea',
  edgeLabelBackground: '#0c1625',
  clusterBkg: 'rgba(41,179,246,0.05)',
  clusterBorder: 'rgba(41,179,246,0.35)',
  titleColor: '#a6ddff',
  secondaryColor: '#0b3a52',
  tertiaryColor: '#15324a',
  nodeBorder: '#29b3f6',
};
const THEMES = {
  dark: base,
  light: {
    ...base,
    primaryColor: '#eaf6fd',
    primaryBorderColor: '#007fc0',
    primaryTextColor: '#0c1625',
    lineColor: '#46587a',
    textColor: '#16233a',
    edgeLabelBackground: '#ffffff',
    clusterBkg: 'rgba(0,159,227,0.05)',
    clusterBorder: 'rgba(0,127,192,0.35)',
    titleColor: '#075783',
    secondaryColor: '#dceefb',
    tertiaryColor: '#eef5fc',
    nodeBorder: '#007fc0',
  },
};

// Restrained palette: grommunio/gromox nodes keep the theme-adaptive brand
// colour (no class); only two accents are used, sparingly —
//   :::ext      → 3rd-party / external services (slate)
//   :::security → the antispam scanning node (amber)
const CLASSDEFS = [
  'classDef ext fill:#3a4a63,stroke:#8295b3,color:#eef2f8;',
  'classDef security fill:#a8691a,stroke:#fbcd6b,color:#ffffff;',
].join('\n');

const want = process.argv.slice(2);
let names = fs.readdirSync(SRC).filter((f) => f.endsWith('.mmd')).map((f) => f.replace(/\.mmd$/, ''));
if (want.length) names = names.filter((n) => want.includes(n));

fs.mkdirSync(OUT, { recursive: true });
const mermaidSrc = fs.readFileSync(MERMAID, 'utf8');

// The SVGs are committed, so a host without a browser keeps the existing ones
// instead of failing the whole deploy.
let browser;
try {
  browser = await launchChromium();
} catch (e) {
  console.warn(`! diagrams not re-rendered, keeping the committed SVGs: ${e.message}`);
  process.exit(0);
}
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body><div id="x"></div></body></html>');

// Load the brand font INTO the render page before Mermaid measures text — else
// boxes get sized for a fallback font and the (wider) Noto Sans glyphs overflow
// and clip the last character.
const FONT_DIR = path.join(ROOT, 'public/fonts');
const FONT_WEIGHTS = { 300: 'notosans-light.woff2', 400: 'notosans-regular.woff2', 600: 'notosans-semibold.woff2', 700: 'notosans-bold.woff2' };
const fontCss = Object.entries(FONT_WEIGHTS).map(([w, f]) => {
  const b64 = fs.readFileSync(path.join(FONT_DIR, f)).toString('base64');
  return `@font-face{font-family:"Noto Sans";font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2");}`;
}).join('\n');
await page.addStyleTag({ content: fontCss });
await page.evaluate(async () => {
  await Promise.all(['300', '400', '600', '700'].map((w) => document.fonts.load(`${w} 16px "Noto Sans"`)));
  await document.fonts.ready;
});

await page.addScriptTag({ content: mermaidSrc });

let count = 0;
for (const name of names) {
  const code = fs.readFileSync(path.join(SRC, `${name}.mmd`), 'utf8') + '\n' + CLASSDEFS + '\n';
  for (const [mode, themeVariables] of Object.entries(THEMES)) {
    // Mermaid stamps the render id into the SVG root and into every CSS rule it
    // emits, so a time- or random-based id makes each run produce a different
    // file and every `npm run gen:diagrams` shows up as 20 meaningless diffs.
    // Deriving it from the diagram name keeps the output byte-reproducible.
    const renderId = `g_${name.replace(/[^A-Za-z0-9]+/g, '_')}_${mode}`;
    const svg = await page.evaluate(async ({ code, themeVariables, renderId }) => {
      // eslint-disable-next-line no-undef
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'base',
        themeVariables,
        // Mermaid 12 switched its defaults to the ELK layout engine and the
        // `neo` look (per-item colouring). Pin the classic dagre layout and look
        // so the committed SVGs keep their geometry and the brand palette above
        // stays the only source of colour.
        layout: 'dagre',
        look: 'classic',
        // Mermaid draws node shapes through rough.js, which treats the default
        // seed of 0 as "pick a random one" — so the bezier control points of
        // every box differed between runs. Any fixed non-zero seed makes the
        // rendered geometry, and therefore the committed SVGs, reproducible.
        handDrawnSeed: 1,
        // useMaxWidth:false → SVG keeps explicit pixel dimensions (+viewBox) so
        // the <Diagram> component can scale it to fit the column via max-width.
        flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis', padding: 12 },
        sequence: { useMaxWidth: false },
      });
      // eslint-disable-next-line no-undef
      const { svg } = await window.mermaid.render(renderId, code);
      return svg;
    }, { code, themeVariables, renderId });
    fs.writeFileSync(path.join(OUT, `${name}-${mode}.svg`), svg.trimEnd() + '\n');
  }
  count++;
  console.log(`✓ ${name} (dark + light)`);
}
await browser.close();
console.log(`Done → ${count} diagram(s) → public/img/arch/`);
