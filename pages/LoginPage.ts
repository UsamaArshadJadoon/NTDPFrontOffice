import { Page, Locator, expect } from '@playwright/test';
import { createSelfHealing } from '../utils/SelfHealingLocator';

export class LoginPage {
  readonly page: Page;
  private selfHealing: ReturnType<typeof createSelfHealing>;

  constructor(page: Page) {
    this.page = page;
    this.selfHealing = createSelfHealing(page);
  }

  /**
   * Get Saudi ID input with self-healing
   */
  private async getSaudiIdInput(): Promise<Locator> {
    return this.selfHealing.findInput({
      type: 'text',
      name: 'id',
      placeholder: 'Saudi ID',
      label: 'Saudi ID',
      identifier: 'SaudiIdInput'
    });
  }

  /**
   * Get Login button with self-healing
   */
  private async getLoginButton(): Promise<Locator> {
    return this.selfHealing.findButton({
      text: /Login/i,
      type: 'submit',
      testId: 'login-button',
      identifier: 'LoginButton'
    });
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
      
      // Try to wait for login elements using self-healing
      try {
        await this.getSaudiIdInput();
        await this.getLoginButton();
      } catch (error) {
        console.log('Login form elements not found - might be after failed login or different page state');
      }
    } catch (error) {
      const err = error as Error;
      if (err.message?.includes('Target page, context or browser has been closed')) {
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
    const input = await this.getSaudiIdInput();
    await input.click();
    await input.fill(saudiId);
    
    // Verify the value was entered correctly
    await expect(input).toHaveValue(saudiId);
  }

  /**
   * Clear field then type ID character by character (simulates user typing)
   * @param saudiId - The Saudi ID to type
   */
  async clearAndTypeId(saudiId: string) {
    const input = await this.getSaudiIdInput();
    await input.click();
    await input.clear();
    for (const ch of saudiId.split('')) {
      await input.type(ch);
    }
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    const button = await this.getLoginButton();
    await expect(button).toBeEnabled();
    await button.click();
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
    const input = await this.getSaudiIdInput();
    const button = await this.getLoginButton();
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    // Button is disabled initially until ID is entered
  }
}
