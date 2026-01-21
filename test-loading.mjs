import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-features=SharedArrayBuffer']
});

// Create a fresh context to avoid cached data
const context = await browser.newContext({
  // Clear storage to force fresh download
  storageState: undefined
});
const page = await context.newPage();

// Clear IndexedDB to force fresh model download
await page.addInitScript(() => {
  indexedDB.deleteDatabase('transformers-cache');
});

// Collect ALL console messages
page.on('console', msg => {
  const text = msg.text();
  console.log('[CONSOLE ' + msg.type() + '] ' + text);
});

// Catch page errors
page.on('pageerror', error => {
  console.log('[PAGE ERROR] ' + error.message);
});

// Catch request failures
page.on('requestfailed', request => {
  console.log('[REQUEST FAILED] ' + request.url() + ' - ' + request.failure().errorText);
});

// Monitor network requests
page.on('request', request => {
  const url = request.url();
  if (url.includes('huggingface') || url.includes('onnx') || url.includes('MiniLM')) {
    console.log('[REQUEST] ' + request.method() + ' ' + url);
  }
});

page.on('response', response => {
  const url = response.url();
  if (url.includes('huggingface') || url.includes('onnx') || url.includes('MiniLM')) {
    console.log('[RESPONSE] ' + response.status() + ' ' + url + ' (' + (response.headers()['content-length'] || 'unknown') + ' bytes)');
  }
});

console.log('Navigating to app (with fresh cache)...');
await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded', timeout: 60000 });

const captureLoadingOnly = process.env.CAPTURE_LOADING === '1';
if (captureLoadingOnly) {
  await page.waitForTimeout(1000);
  const screenshotPath = process.env.SCREENSHOT_PATH || '/tmp/loading-screenshot.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
  await browser.close();
  process.exit(0);
}

// Wait for loading to complete or timeout
console.log('Waiting for model to load (max 120s)...');
const startTime = Date.now();
let lastProgress = '';

while (Date.now() - startTime < 120000) {
  try {
    // Check if ConfigPanel is visible (means loading is done)
    const configPanel = await page.locator('[data-testid="config-panel"]').isVisible();
    if (configPanel) {
      console.log('SUCCESS: Loading complete! ConfigPanel is visible.');
      break;
    }

    // Get current progress
    const progressBar = await page.locator('[role="progressbar"]').textContent();
    const elapsed = await page.locator('[data-testid="elapsed-timer"]').textContent();
    if (progressBar !== lastProgress) {
      console.log('UI Progress: ' + progressBar + ' ' + elapsed);
      lastProgress = progressBar;
    }
  } catch (e) {
    // Ignore selector errors
  }
  await page.waitForTimeout(1000);
}

const elapsed = Math.round((Date.now() - startTime) / 1000);
console.log('Test finished after ' + elapsed + 's');

const screenshotPath = process.env.SCREENSHOT_PATH || '/tmp/loading-screenshot.png';
const shouldStartSimulation =
  process.env.SIM_START === '1' ||
  Boolean(process.env.TARGET_CHAPTER) ||
  Boolean(process.env.STEP_FORWARD) ||
  process.env.HOVER_VECTOR === '1';

if (shouldStartSimulation) {
  const beginButton = page.locator('[data-testid="begin-simulation"]');
  if (await beginButton.isVisible()) {
    await beginButton.click();
    await page.waitForTimeout(500);
  }
}

if (process.env.TARGET_CHAPTER) {
  const chapterIndex = Number.parseInt(process.env.TARGET_CHAPTER, 10);
  if (Number.isFinite(chapterIndex)) {
    const marker = page.locator(`[data-testid="chapter-marker-${chapterIndex}"]`);
    if (await marker.isVisible()) {
      await marker.click();
      await page.waitForTimeout(400);
    }
  }
}

if (process.env.STEP_FORWARD) {
  const stepCount = Number.parseInt(process.env.STEP_FORWARD, 10);
  if (Number.isFinite(stepCount)) {
    const nextButton = page.getByRole('button', { name: /next/i });
    for (let i = 0; i < stepCount; i += 1) {
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);
      }
    }
  }
}

if (process.env.HOVER_VECTOR === '1') {
  const candidate = page.locator('[data-testid="vector-space-candidate"]').first();
  if (await candidate.isVisible()) {
    await candidate.hover();
    await page.waitForTimeout(300);
  }
}

if (process.env.OPEN_CRT_CONTROLS === '1') {
  const handle = page.locator('[data-testid="crt-controls-handle"]');
  if (await handle.isVisible()) {
    await handle.click();
    await page.waitForTimeout(600);
  }
}

// Take screenshot
await page.screenshot({ path: screenshotPath, fullPage: true });
console.log(`Screenshot saved to ${screenshotPath}`);

await browser.close();
