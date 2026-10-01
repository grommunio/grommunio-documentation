/**
 * Headless Chromium for the diagram, PDF and EPUB generators.
 *
 * Playwright's own browser build is preferred. `npm ci` does not download it,
 * and `playwright install --with-deps` only works on apt-based systems, so on
 * hosts without it (e.g. openSUSE build servers) a system Chromium/Chrome is
 * used instead: $CHROMIUM_PATH if set, otherwise the first browser found on
 * $PATH.
 *
 *   node scripts/lib/browser.mjs --ensure
 *     exits 0 if a browser can be launched, downloading Playwright's Chromium
 *     (without system dependencies) when none is available; exits 1 otherwise.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const SYSTEM_BROWSERS = [
  'chromium', 'chromium-browser', 'google-chrome-stable', 'google-chrome',
  '/usr/lib64/chromium/chromium', '/usr/lib/chromium/chromium',
];

function findSystemBrowser() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  for (const name of SYSTEM_BROWSERS) {
    if (name.startsWith('/')) {
      if (fs.existsSync(name)) return name;
      continue;
    }
    for (const dir of (process.env.PATH || '').split(path.delimiter)) {
      const p = path.join(dir, name);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function bundledBrowserPresent() {
  try {
    return fs.existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

/** Launch headless Chromium, or throw an error explaining how to get one. */
export async function launchChromium(opts = {}) {
  if (!process.env.CHROMIUM_PATH && bundledBrowserPresent()) return chromium.launch(opts);
  const executablePath = findSystemBrowser();
  if (executablePath) return chromium.launch({ ...opts, executablePath });
  throw new Error(
    'No Chromium available. Run `npx playwright install chromium` (without --with-deps, ' +
    'which needs apt-get), install the distribution chromium package, or set CHROMIUM_PATH.',
  );
}

async function canLaunch() {
  try {
    const browser = await launchChromium();
    await browser.close();
    return true;
  } catch (e) {
    console.error(`  ${e.message.split('\n')[0]}`);
    return false;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--ensure')) {
  if (await canLaunch()) process.exit(0);
  console.log('  downloading Playwright Chromium…');
  try {
    execFileSync('npx', ['playwright', 'install', 'chromium'], { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
  process.exit((await canLaunch()) ? 0 : 1);
}
