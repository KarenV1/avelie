// verify_b1.cjs — drives BlockScreen b1 via Playwright + system Chrome
const { chromium } = require('playwright');
const { mkdirSync }  = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL    = 'http://localhost:5199/curso/sql-basico/unidad/u1/bloque/b1';
const SSDIR  = 'd:/Karen/Avelie/files/screenshots';
const SS     = (n) => `${SSDIR}/${n}.png`;

mkdirSync(SSDIR, { recursive: true });

const results = [];
const log = (icon, msg, extra = '') => {
  results.push({ icon, msg, extra });
  console.log(`${icon} ${msg}${extra ? ' — ' + extra : ''}`);
};

async function stepState(page) {
  return page.evaluate(() => {
    const progress    = document.querySelector('.learn__donenote')?.textContent?.trim() ?? '';
    const hasInfo     = !!document.querySelector('.learn__example');
    const hasCtxBlock = !!document.querySelector('pre.code-block');
    const hasOpts     = !!document.querySelector('.quiz__options');
    const btn         = document.querySelector('.learn__actions button');
    const btnText     = btn?.textContent?.trim() ?? '';
    const btnDisabled = btn?.disabled ?? false;
    const feedback    = document.querySelector('.feedback')?.textContent?.trim().slice(0, 100) ?? '';
    return { progress, hasInfo, hasCtxBlock, hasOpts, btnText, btnDisabled, feedback };
  });
}

async function clickOption(page, idx) {
  const opts = await page.$$('.quiz__option');
  if (opts[idx]) await opts[idx].click();
}

async function advance(page) {
  await page.click('.learn__actions button');
  await page.waitForTimeout(350);
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page    = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.screenshot({ path: SS('s00_landing') });
  log('📸', 'Landed on b1', URL);

  // ── STEP 1: info ──────────────────────────────────────────────────
  let s = await stepState(page);
  await page.screenshot({ path: SS('s01_info') });
  log(s.progress.includes('Paso 1') ? '✅' : '❌', 'Step 1 — label', s.progress);
  log(s.hasInfo ? '✅' : '❌',   'Step 1 — info card rendered');
  log(!s.hasOpts ? '✅' : '❌',  'Step 1 — no options (non-interactive)');
  log(s.btnText.includes('Siguiente') ? '✅' : '❌', 'Step 1 — button is Siguiente', s.btnText);
  log(!s.btnDisabled ? '✅' : '❌', 'Step 1 — Siguiente not disabled');

  await advance(page); // → step 2 (info)
  await advance(page); // → step 3 (table_reading)

  // ── STEP 3: table_reading — context + Comprobar disabled ─────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s03_table_reading') });
  log(s.progress.includes('Paso 3') ? '✅' : '❌', 'Step 3 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 3 — table context block shown');
  log(s.hasOpts ? '✅' : '❌',     'Step 3 — options rendered');
  log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 3 — button is Comprobar', s.btnText);
  log(s.btnDisabled ? '✅' : '❌', 'Step 3 — Comprobar disabled before selection');

  await clickOption(page, 0); // intentional wrong answer
  s = await stepState(page);
  log(!s.btnDisabled ? '✅' : '❌', 'Step 3 — Comprobar enabled after selecting');
  await advance(page); // Comprobar
  s = await stepState(page);
  await page.screenshot({ path: SS('s03_wrong_feedback') });
  log(s.feedback.length > 0 ? '✅' : '❌', 'Step 3 — feedback on wrong answer', s.feedback.slice(0, 60));
  await advance(page); // Siguiente → step 4

  // ── STEP 4: multiple_choice WITH table context (key fix) ──────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s04_mc_with_table') });
  log(s.progress.includes('Paso 4') ? '✅' : '❌', 'Step 4 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 4 — table context block shown (core fix)');
  log(s.hasOpts ? '✅' : '❌',     'Step 4 — options rendered');
  log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 4 — button is Comprobar', s.btnText);

  await clickOption(page, 2); // correct: "Una fila o registro (row)"
  await advance(page); // Comprobar
  s = await stepState(page);
  await page.screenshot({ path: SS('s04_correct_feedback') });
  log(s.feedback.length > 0 ? '✅' : '❌', 'Step 4 — correct feedback', s.feedback.slice(0, 60));
  await advance(page); // → step 5

  // ── Steps 5–9: navigate through ──────────────────────────────────
  for (let i = 5; i <= 9; i++) {
    s = await stepState(page);
    if (s.hasOpts) {
      await clickOption(page, 1);
      await advance(page); // Comprobar
    }
    await advance(page); // Siguiente
  }

  // ── STEP 10: example — code shown, no options ────────────────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s10_example') });
  log(s.progress.includes('Paso 10') ? '✅' : '❌', 'Step 10 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 10 — code block shown');
  log(!s.hasOpts ? '✅' : '❌',    'Step 10 — no options (non-interactive)');
  log(s.btnText.includes('Siguiente') ? '✅' : '❌', 'Step 10 — Siguiente (no Comprobar)', s.btnText);
  await advance(page); // → step 11

  // ── STEP 11: multiple_choice WITH code context ────────────────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s11_mc_code') });
  log(s.progress.includes('Paso 11') ? '✅' : '❌', 'Step 11 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 11 — code context shown (SELECT *)');
  log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 11 — button is Comprobar', s.btnText);
  await clickOption(page, 1); // correct
  await advance(page);
  s = await stepState(page);
  log(s.feedback.length > 0 ? '✅' : '❌', 'Step 11 — feedback', s.feedback.slice(0, 60));
  await advance(page); // → step 12

  // ── STEP 12: fill_blank WITH code context ─────────────────────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s12_fill_blank') });
  log(s.progress.includes('Paso 12') ? '✅' : '❌', 'Step 12 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 12 — code context shown (FROM clause fix)');
  log(s.btnText.includes('Comprobar') ? '✅' : '❌', 'Step 12 — button is Comprobar', s.btnText);
  await clickOption(page, 1); // correct: FROM clientes
  await advance(page);
  await advance(page); // → step 13

  // ── STEP 13: code_choice ──────────────────────────────────────────
  s = await stepState(page);
  log(s.progress.includes('Paso 13') ? '✅' : '❌', 'Step 13 — label', s.progress);
  await clickOption(page, 1); // correct: SELECT * FROM clientes;
  await advance(page);
  await advance(page); // → step 14

  // ── STEP 14: debug WITH code context ─────────────────────────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s14_debug') });
  log(s.progress.includes('Paso 14') ? '✅' : '❌', 'Step 14 — label', s.progress);
  log(s.hasCtxBlock ? '✅' : '❌', 'Step 14 — buggy code shown as context');
  await clickOption(page, 1);
  await advance(page);
  await advance(page); // → step 15

  // ── STEP 15: summary ─────────────────────────────────────────────
  s = await stepState(page);
  await page.screenshot({ path: SS('s15_summary') });
  log(s.progress.includes('Paso 15') ? '✅' : '❌', 'Step 15 — label', s.progress);
  log(s.hasInfo ? '✅' : '❌',  'Step 15 — summary card shown');
  log(!s.hasOpts ? '✅' : '❌', 'Step 15 — no options');
  log(s.btnText.includes('Siguiente') ? '✅' : '❌', 'Step 15 — Siguiente button', s.btnText);
  await advance(page); // → complete or review

  // ── After last step: expect review pass or completion ────────────
  await page.waitForTimeout(500);
  s = await stepState(page);
  await page.screenshot({ path: SS('s16_final') });
  const banner = await page.evaluate(() =>
    document.querySelector('.feedback--ok')?.textContent?.trim() ?? ''
  );
  // With 2 wrong answers (step 3 wrong), expect review loop first
  const isReview = s.progress.toLowerCase().includes('repaso');
  const isComplete = banner.includes('completado') || banner.includes('completo');
  log(isReview || isComplete ? '✅' : '⚠️',
    isReview ? 'Error review loop triggered (wrong answers cycling back)' : 'Block completed',
    isReview ? s.progress : banner.slice(0, 60));

  await browser.close();

  // ── Summary ───────────────────────────────────────────────────────
  const passes = results.filter(r => r.icon === '✅').length;
  const fails  = results.filter(r => r.icon === '❌').length;
  const warns  = results.filter(r => r.icon === '⚠️').length;
  console.log(`\n─────────────────────────────`);
  console.log(`TOTAL: ${passes} passed, ${fails} failed, ${warns} warnings`);
  console.log(`─────────────────────────────`);
  if (fails > 0) {
    console.log('\nFailed:');
    results.filter(r => r.icon === '❌').forEach(r => console.log(`  ❌ ${r.msg}: ${r.extra}`));
  }
})().catch(e => { console.error('SCRIPT ERROR:', e.message); process.exit(1); });
