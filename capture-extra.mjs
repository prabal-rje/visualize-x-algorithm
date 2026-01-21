import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5174/';
const OUTPUT_DIR = '.codex/screenshots_review_1';

async function capture() {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Navigate to Chapter 5 for the delivery view
  await page.click('button:has-text("DELIVER")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/130-ch5-delivery-rankings.png` });

  // Test keyboard focus - press Tab multiple times
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.screenshot({ path: `${OUTPUT_DIR}/131-keyboard-focus-visible.png` });

  // Capture hover on navigation button
  const startOverBtn = page.locator('button:has-text("START OVER")');
  await startOverBtn.hover();
  await page.screenshot({ path: `${OUTPUT_DIR}/132-hover-state-button.png` });

  // Back to Chapter 0 and scroll to see all personas
  await page.click('button:has-text("LOADOUT")');
  await page.waitForTimeout(1000);

  // Try to scroll within arena if possible
  const arena = page.locator('[class*="arena"]').first();
  if (await arena.count() > 0) {
    await arena.evaluate(el => el.scrollTop = 500);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUTPUT_DIR}/133-ch0-personas-scrolled.png` });

  await browser.close();
  console.log('Extra screenshots saved');
}

capture().catch(console.error);
