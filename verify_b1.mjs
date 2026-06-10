// verify_b1.mjs — drives BlockScreen b1 via Playwright with system Chrome
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE   = 'http://localhost:5199';
const URL    = `${BASE}/curso/sql-basico/unidad/u1/bloque/b1`;
const SS     = (name) => `d:/Karen/Avelie/files/screenshots/${name}.png`;

import { mkdirSync } from 'fs';
mkdirSync('d:/Karen/Avelie/files/screenshots', { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page    = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 }); // mobile-ish

const results = [];
const log = (icon, msg, extra = '') => {
  results.push({ icon, msg, extra });
  console.log(`${icon} ${msg}${extra ? ' — ' + extra : ''}`);
};

await page.goto(URL, { waitUntil: 'networkidle' });
await page.screenshot({ path: SS('s00_landing') });
log('📸', 'Landed on b1', URL);

// ── Helper: read current step state ──────────────────────────────────
async function stepState() {
  return page.evaluate(() => {
    const progress  = document.querySelector('.learn__donenote')?.textContent?.trim() ?? '';
    const hasInfo   = !!document.querySelector('.learn__example');
    const hasTable  = !!document.querySelector('.learn__example pre.code-block');
    const hasPrompt = !!document.querySelector('.quiz__prompt');
    const hasOpts   = !!document.querySelector('.quiz__options');
    const btnNext   = document.querySelector('.learn__actions button');
    const btnText   = btnNext?.textContent?.trim() ?? '';
    const btnDisabled = btnNext?.disabled ?? false;
    const feedbackEl  = document.querySelector('.feedback');
    const feedback    = feedbackEl?.textContent?.trim().slice(0, 80) ?? '';
    return { progress, hasInfo, hasTable, hasPrompt, hasOpts, btnText, btnDisabled, feedback };
  });
}

// ── STEP 1: info — should show Siguiente without selection ───────────
let s = await stepState();
log(s.progress.includes('Paso 1') ? '✅' : '❌', 'Step 1 progress label', s.progress);
log(s.hasInfo ? '✅' : '❌', 'Step 1 is info card (hasInfo)', String(s.hasInfo));
log(!s.hasOpts ? '✅' : '❌', 'Step 1 has no options (not interactive)', String(!s.hasOpts));
log(s.btnText.includes('Siguiente') ? '✅' : '❌', 'Step 1 button is Siguiente', s.btnText);
log(!s.btnDisabled ? '✅' : '❌', 'Siguiente not disabled on info step', String(!s.btnDisabled));
await page.screenshot({ path: SS('s01_info') });

// advance through 2 info steps
await page.click('.learn__actions button');
await page.waitForTimeout(300);
await page.click('.learn__actions button');
await page.waitForTimeout(300);

// ── STEP 3: table_reading — should show table context + Comprobar ─────
s = await stepState();
await page.screenshot({ path: SS('s03_table_reading') });
log(s.progress.includes('Paso 3') ? '✅' : '❌', 'Step 3 progress label', s.progress);
log(s.hasTable ? '✅' : '❌', 'Step 3 shows table context block', String(s.hasTable));
log(s.hasOpts ? '✅' : '❌', 'Step 3 has options', String(s.hasOpts));
log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 3 button is Comprobar', s.btnText);
log(s.btnDisabled ? '✅' : '❌', 'Comprobar disabled before selection', String(s.btnDisabled));

// select wrong answer (option A = "1")
await page.click('.quiz__option:nth-child(1)');
await page.waitForTimeout(200);
s = await stepState();
log(!s.btnDisabled ? '✅' : '❌', 'Comprobar enabled after selection', String(!s.btnDisabled));
await page.click('.learn__actions button'); // Comprobar
await page.waitForTimeout(300);
s = await stepState();
await page.screenshot({ path: SS('s03_wrong') });
log(s.feedback.length > 0 ? '✅' : '❌', 'Feedback shown after wrong answer', s.feedback);
await page.click('.learn__actions button'); // Siguiente
await page.waitForTimeout(300);

// ── STEP 4: multiple_choice — should show table context ───────────────
s = await stepState();
await page.screenshot({ path: SS('s04_mc_with_table') });
log(s.progress.includes('Paso 4') ? '✅' : '❌', 'Step 4 progress label', s.progress);
log(s.hasTable ? '✅' : '❌', 'Step 4 shows table context (key fix)', String(s.hasTable));
log(s.hasOpts ? '✅' : '❌', 'Step 4 has options', String(s.hasOpts));
log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 4 button is Comprobar', s.btnText);

// answer correctly (option C = index 2 = "Una fila o registro")
const opts4 = await page.$$('.quiz__option');
await opts4[2].click();
await page.waitForTimeout(200);
await page.click('.learn__actions button'); // Comprobar
await page.waitForTimeout(300);
s = await stepState();
await page.screenshot({ path: SS('s04_correct') });
log(s.feedback.includes('Exacto') || s.feedback.includes('fila') ? '✅' : '❌', 'Step 4 correct feedback', s.feedback);
await page.click('.learn__actions button'); // Siguiente
await page.waitForTimeout(300);

// ── Navigate to step 10 (example) and step 11 (code context) ─────────
// Steps 5 (mc), 6 (info), 7 (table_reading), 8 (fill_blank), 9 (info)
// We'll quickly advance answering correctly or clicking next

for (let i = 5; i <= 9; i++) {
  s = await stepState();
  if (s.hasOpts) {
    // interactive: pick first non-disabled option or correct one
    const allOpts = await page.$$('.quiz__option');
    // For simplicity pick option B (index 1) — may be wrong, that's fine, we test error repeat later
    if (allOpts.length > 1) await allOpts[1].click();
    await page.waitForTimeout(200);
    await page.click('.learn__actions button'); // Comprobar
    await page.waitForTimeout(300);
  }
  await page.click('.learn__actions button'); // Siguiente
  await page.waitForTimeout(300);
}

// ── STEP 10: example — code block, Siguiente without selection ────────
s = await stepState();
await page.screenshot({ path: SS('s10_example') });
log(s.progress.includes('Paso 10') ? '✅' : '❌', 'Step 10 progress label', s.progress);
log(s.hasTable ? '✅' : '❌', 'Step 10 shows code block (example)', String(s.hasTable));
log(!s.hasOpts ? '✅' : '❌', 'Step 10 has no options', String(!s.hasOpts));
log(s.btnText.includes('Siguiente') ? '✅' : '❌', 'Step 10 Siguiente (no Comprobar)', s.btnText);
await page.click('.learn__actions button');
await page.waitForTimeout(300);

// ── STEP 11: multiple_choice with code context ────────────────────────
s = await stepState();
await page.screenshot({ path: SS('s11_mc_code') });
log(s.progress.includes('Paso 11') ? '✅' : '❌', 'Step 11 progress label', s.progress);
log(s.hasTable ? '✅' : '❌', 'Step 11 shows code context (SELECT *)', String(s.hasTable));
log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 11 button is Comprobar', s.btnText);
await browser.close();

// ── Summary ───────────────────────────────────────────────────────────
const passes  = results.filter(r => r.icon === '✅').length;
const fails   = results.filter(r => r.icon === '❌').length;
console.log(`\n─────────────────────────────`);
console.log(`TOTAL: ${passes} passed, ${fails} failed`);
console.log(`─────────────────────────────`);
if (fails > 0) {
  console.log('\nFAILED checks:');
  results.filter(r => r.icon === '❌').forEach(r => console.log(`  ❌ ${r.msg}: ${r.extra}`));
}
