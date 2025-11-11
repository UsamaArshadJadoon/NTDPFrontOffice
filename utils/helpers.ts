import { Page } from '@playwright/test';

/**
 * Wait for a specific element to be visible
 * @param page - Playwright page object
 * @param selector - CSS selector or locator
 * @param timeout - Timeout in milliseconds (default: 10000)
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 10000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for network to be idle
 * @param page - Playwright page object
 * @param timeout - Timeout in milliseconds (default: 30000)
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for page navigation to complete
 * @param page - Playwright page object
 */
export async function waitForNavigation(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for URL to change
 * @param page - Playwright page object
 * @param urlPattern - RegExp pattern or string to match
 * @param timeout - Timeout in milliseconds (default: 15000)
 */
export async function waitForUrlChange(page: Page, urlPattern: string | RegExp, timeout: number = 15000) {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Wait for URL to NOT contain a pattern
 * @param page - Playwright page object
 * @param pattern - String pattern to check against
 * @param timeout - Timeout in milliseconds (default: 15000)
 */
export async function waitForUrlNotContaining(page: Page, pattern: string, timeout: number = 15000) {
  await page.waitForURL(url => !url.pathname.includes(pattern), { timeout });
}

/**
 * Custom wait with retry logic
 * @param condition - Async function that returns boolean
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @param interval - Retry interval in milliseconds (default: 500)
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 10000,
  interval: number = 500
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Take screenshot with timestamp
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to wait
 */
export async function delay(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}
