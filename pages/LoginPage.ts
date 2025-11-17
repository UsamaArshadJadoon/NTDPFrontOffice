import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly saudiIdInput: Locator;
  readonly loginButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saudiIdInput = page.locator('input[type="text"], input[name*="id"], input[id*="id"], input').first();
    this.loginButton = page.getByRole('button', { name: 'Login login' });
    this.pageTitle = page.locator('h1, h2, .page-title');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await this.waitForPageLoad();
  }

  /**
   * Wait for login page to fully load
   */
  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => 
        this.page.waitForLoadState('domcontentloaded', { timeout: 30000 })
      );
      
      // Try to wait for login elements, but don't fail if they're not available (might be after failed login)
      try {
        await expect(this.saudiIdInput).toBeVisible({ timeout: 20000 });
        await expect(this.loginButton).toBeVisible({ timeout: 20000 });
      } catch (error) {
        console.log('Login form elements not found - might be after failed login or different page state');
        // Don't throw error, just log it - page might be in a different state
      }
    } catch (error) {
      // Handle closed page/context gracefully
      if (error.message?.includes('Target page, context or browser has been closed')) {
        throw new Error('Browser context closed during page load');
      }
      throw error;
    }
  }

  /**
   * Enter Saudi ID in the input field
   * @param saudiId - The Saudi ID number to enter
   */
  async enterSaudiId(saudiId: string) {
    await this.saudiIdInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.saudiIdInput.click();
    await this.saudiIdInput.fill(saudiId);
    
    // Verify the value was entered correctly
    await expect(this.saudiIdInput).toHaveValue(saudiId);
  }

  /**
   * Clear field then type ID character by character (simulates user typing)
   * @param saudiId - The Saudi ID to type
   */
  async clearAndTypeId(saudiId: string) {
    await this.saudiIdInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.saudiIdInput.click();
    await this.saudiIdInput.clear();
    for (const ch of saudiId.split('')) {
      await this.saudiIdInput.type(ch);
    }
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  /**
   * Perform complete login flow
   * @param saudiId - The Saudi ID number to login with
   */
  async login(saudiId: string) {
    await this.enterSaudiId(saudiId);
    await this.clickLogin();
    
    // Wait for response
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    
    // Check for login failure error message
    const errorMessage = await this.page.locator(':has-text("Login failed")').textContent().catch(() => null);
    if (errorMessage) {
      throw new Error(`Login failed with Saudi ID ${saudiId}: ${errorMessage}`);
    }
  }

  /**
   * Check if login failed by looking for error messages
   */
  async hasLoginError(): Promise<string | null> {
    const errorSelectors = [
      ':has-text("Login failed")',
      ':has-text("Invalid")', 
      ':has-text("Error")',
      '.error',
      '.alert-danger',
      '[class*="error"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector);
      if (await errorElement.isVisible().catch(() => false)) {
        return await errorElement.textContent();
      }
    }
    return null;
  }

  /**
   * Verify login page elements are displayed correctly
   * Note: Login button is disabled until valid Saudi ID is entered
   */
  async verifyLoginPageElements() {
    await expect(this.saudiIdInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    // Button is disabled initially until ID is entered
  }
}
