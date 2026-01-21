import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5174/';
const OUTPUT_DIR = '.codex/screenshots_review_1';

async function capture() {
  const browser = await chromium.launch({ headless: false });

  // Desktop 1440x900
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Screenshot 100: Desktop full page - Chapter 0
  await page.screenshot({ path: `${OUTPUT_DIR}/100-desktop-ch0-full.png`, fullPage: true });

  // Screenshot 101: Desktop viewport only
  await page.screenshot({ path: `${OUTPUT_DIR}/101-desktop-ch0-viewport.png` });

  // Scroll to persona section
  await page.evaluate(() => document.querySelector('[class*="arena"]')?.scrollTo(0, 300));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUTPUT_DIR}/102-desktop-ch0-personas.png` });

  // Click Chapter 1
  await page.click('button:has-text("REQUEST")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/103-desktop-ch1-request.png` });

  // Click Chapter 2
  await page.click('button:has-text("GATHER")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/104-desktop-ch2-gather.png` });

  // Click Chapter 3
  await page.click('button:has-text("FILTER")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/105-desktop-ch3-filter.png` });

  // Click Chapter 4
  await page.click('button:has-text("SCORE")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/106-desktop-ch4-score.png` });

  // Click Chapter 5
  await page.click('button:has-text("DELIVER")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUTPUT_DIR}/107-desktop-ch5-deliver.png` });

  await ctx.close();

  // Mobile 390x844
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: `${OUTPUT_DIR}/110-mobile-ch0.png`, fullPage: true });

  await mobileCtx.close();

  // Tablet 768x1024
  const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tabletPage = await tabletCtx.newPage();
  await tabletPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await tabletPage.waitForTimeout(2000);
  await tabletPage.screenshot({ path: `${OUTPUT_DIR}/115-tablet-ch0.png`, fullPage: true });

  await tabletCtx.close();

  // Large desktop 1920x1080
  const largeCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const largePage = await largeCtx.newPage();
  await largePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await largePage.waitForTimeout(2000);
  await largePage.screenshot({ path: `${OUTPUT_DIR}/120-large-desktop-ch0.png`, fullPage: true });

  await largeCtx.close();
  await browser.close();

  console.log('Screenshots saved to', OUTPUT_DIR);
}

capture().catch(console.error);
