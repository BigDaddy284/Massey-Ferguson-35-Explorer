// Browser smoke test (Phase 9): opens every view at desktop, tablet and phone widths from file://
// and fails on page errors, console errors or sideways page scroll. Needs Playwright with Chromium
// (not a dependency of the app).   node scripts/smoke.mjs [--shots outdir]
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
if (shots) mkdirSync(shots, { recursive: true });
const ROUTES = ['#/anatomy', '#/anatomy/hyd-pump', '#/catalogue', '#/exploded', '#/diagram/engine', '#/technical',
  '#/technical/term-0', '#/identification', '#/tractor', '#/research'];
const SIZES = { desktop: [1440, 900], tablet: [820, 1180], phone: [390, 844] };

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
let failures = 0;
for (const [name, [w, h]] of Object.entries(SIZES)) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: name !== 'desktop' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const t0 = Date.now();
  await page.goto('file://' + join(root, 'app/index.html') + '#/anatomy', { waitUntil: 'commit' });
  await page.waitForFunction(() => window.MF35Explorer && window.MF35Explorer.viewer(), null, { timeout: 60000 });
  const fcp = await page.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? Math.round(e.startTime) : null; });
  console.log(`${name.padEnd(8)} first paint ${fcp} ms, 3D ready ${Date.now() - t0} ms (software WebGL)`);
  for (const r of ROUTES) {
    await page.evaluate((r) => { location.hash = r; }, r);
    await page.waitForTimeout(400);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w + 1) { failures++; console.log(`  FAIL ${r}: page is ${sw}px wide at ${w}px`); }
    if (shots) await page.screenshot({ path: join(shots, `${name}-${r.replace(/[#/]+/g, '_')}.png`) });
  }
  // Global search: a query lists results and a "see all" row that opens the catalogue.
  await page.evaluate(() => { location.hash = '#/anatomy'; });
  await page.fill('#global-search', 'brake');
  const n = await page.locator('#search-results .search-result').count();
  const all = await page.locator('#search-results .search-all').count();
  if (!n || !all) { failures++; console.log('  FAIL search: no results or no "see all" row'); }
  await page.locator('#search-results .search-all').dispatchEvent('mousedown');
  await page.waitForTimeout(300);
  if (!(await page.evaluate(() => location.hash.startsWith('#/catalogue')))) { failures++; console.log('  FAIL search: "see all" did not open the catalogue'); }
  // Idle 3D view should not keep redrawing.
  await page.evaluate(() => { location.hash = '#/anatomy'; });
  await page.waitForTimeout(1500);
  const f0 = await page.evaluate(() => window.MF35Explorer.viewer().frames);
  await page.waitForTimeout(1000);
  const f1 = await page.evaluate(() => window.MF35Explorer.viewer().frames);
  if (f1 - f0 > 2) { failures++; console.log(`  FAIL idle 3D view drew ${f1 - f0} frames in 1 s`); }
  if (errors.length) { failures++; console.log('  FAIL errors:', errors.slice(0, 5)); }
  await page.close();
}
await browser.close();
if (failures) { console.log(`${failures} failure(s)`); process.exit(1); }
console.log('smoke OK');
