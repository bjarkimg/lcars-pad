#!/usr/bin/env node
/**
 * Capture LCARS tabs at Galaxy Z Fold cover (22:9) and inner (10:9) viewports.
 *
 *   npm run shots
 *   npm run shots -- --tab sudoku
 *   npm run shots -- --device cover --url http://127.0.0.1:5173
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs/images/fold');

const VIEWPORTS = {
  cover: { width: 412, height: 960, ratio: '22:9' },
  inner: { width: 1080, height: 1200, ratio: '9:10' },
};

const TABS = ['sudoku', 'merge', 'harness'];

const CHROMIUM = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

function has(flag) {
  return process.argv.includes(flag);
}

const urlBase = (arg('--url', process.env.LCARS_URL || 'http://127.0.0.1:5173')).replace(/\/$/, '');
const onlyTab = arg('--tab', null);
const onlyDevice = arg('--device', null);
const scale = Number(arg('--scale', '2')) || 2;
const tabs = onlyTab ? [onlyTab] : TABS;
const devices = onlyDevice ? [onlyDevice] : ['cover', 'inner'];

for (const tab of tabs) {
  if (!TABS.includes(tab)) {
    console.error(`Unknown tab: ${tab}. Use: ${TABS.join(', ')}`);
    process.exit(1);
  }
}
for (const device of devices) {
  if (!VIEWPORTS[device]) {
    console.error(`Unknown device: ${device}. Use: cover, inner`);
    process.exit(1);
  }
}

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

await mkdir(OUT_DIR, { recursive: true });
const index = [];

try {
  for (const device of devices) {
    const vp = VIEWPORTS[device];
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: scale,
      isMobile: device === 'cover',
      hasTouch: true,
      colorScheme: 'dark',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);

    for (const tab of tabs) {
      const url = `${urlBase}/?tab=${tab}#${tab}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      await page.evaluate(async (nextTab) => {
        if (document.fonts?.ready) await document.fonts.ready;
        window.location.hash = nextTab;
      }, tab);
      await page.waitForTimeout(250);

      const file = `${tab}-${device}.png`;
      const dest = join(OUT_DIR, file);
      await page.screenshot({ path: dest, fullPage: false, type: 'png' });
      index.push({ tab, device, file, width: vp.width, height: vp.height, ratio: vp.ratio, scale });
      console.log(`wrote ${file}  ${vp.width}×${vp.height} @${scale}x  ${url}`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

const indexPath = join(OUT_DIR, 'index.json');
if (onlyTab || onlyDevice) {
  try {
    const previous = JSON.parse(await readFile(indexPath, 'utf8'));
    const keep = previous.filter((entry) => {
      if (onlyTab && onlyDevice) return !(entry.tab === onlyTab && entry.device === onlyDevice);
      if (onlyTab) return entry.tab !== onlyTab;
      return entry.device !== onlyDevice;
    });
    index.unshift(...keep);
  } catch {
    // first run
  }
}
await writeFile(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log(`\n${index.length} shots → ${OUT_DIR}`);
