// Capture des concepts « f » : quatre états en desktop, trois en téléphone.
// Usage : node capture3.mjs f1 [f2 ...]
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const DIR = '/tmp/claude-0/-home-user-MG-SITE/9d5c93dd-0bf5-5524-906d-697c0ddde50a/scratchpad/mockups';
const OUT = '/tmp/claude-0/-home-user-MG-SITE/9d5c93dd-0bf5-5524-906d-697c0ddde50a/scratchpad/shots3';
const only = process.argv.slice(2);
const dirs = only.length ? only : ['f1', 'f4', 'f5'];
const browser = await chromium.launch();
const report = [];
for (const d of dirs) {
  for (const vp of [
    { tag: 'd', width: 1440, height: 900, mobile: false, states: [0, 1, 2, 3] },
    { tag: 'm', width: 390, height: 844, mobile: true, states: [0, 1, 2] },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1.5, isMobile: vp.mobile, hasTouch: vp.mobile });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message)));
    await page.goto(`file://${DIR}/${d}.html`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    const hasState = await page.evaluate(() => typeof window.mgState === 'function');
    // La page peut déclarer son nombre d'états : window.mgStates = { d: 6, m: 6 }
    const declared = await page.evaluate(() => (window.mgStates || null));
    const states = declared && declared[vp.tag] ? [...Array(declared[vp.tag]).keys()] : vp.states;
    for (const s of states) {
      if (hasState) await page.evaluate(n => window.mgState(n), s);
      await page.waitForTimeout(1600);
      await page.screenshot({ path: `${OUT}/${d}-${vp.tag}${s}.jpg`, type: 'jpeg', quality: 86 });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    report.push(`${d} ${vp.tag} · mgState:${hasState ? 'oui' : 'NON'} · débordement:${overflow}px${errs.length ? ' · ⚠ ' + errs[0] : ''}`);
    await ctx.close();
  }
}
await browser.close();
console.log(report.join('\n'));
