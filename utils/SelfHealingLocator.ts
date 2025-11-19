import { Page, Locator } from '@playwright/test';

/**
 * Self-Healing Locator Utility
 * Automatically tries multiple strategies to find elements when primary locator fails
 */
export class SelfHealingLocator {
  private page: Page;
  private locatorHistory: Map<string, string[]> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Create a self-healing locator that tries multiple strategies
   * @param primarySelector - Main selector to try first
   * @param fallbackSelectors - Alternative selectors to try if primary fails
   * @param identifier - Unique identifier for logging/tracking
   */
  async findElement(
    primarySelector: string,
    fallbackSelectors: string[],
    identifier: string
  ): Promise<Locator> {
    // Try primary selector first
    try {
      const element = this.page.locator(primarySelector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      this.logSuccess(identifier, primarySelector);
      return element;
    } catch (error) {
      console.log(`⚠️ Primary selector failed for ${identifier}: ${primarySelector}`);
    }

    // Try fallback selectors
    for (const selector of fallbackSelectors) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`✅ Self-healed ${identifier} using: ${selector}`);
        this.updateLocatorHistory(identifier, selector);
        return element;
      } catch (error) {
        console.log(`⚠️ Fallback selector failed for ${identifier}: ${selector}`);
      }
    }

    throw new Error(`❌ All selectors failed for ${identifier}`);
  }

  /**
   * Smart locator that tries multiple strategies automatically
   * Uses Playwright's built-in auto-waiting and retry logic
   */
  async smartLocator(options: {
    role?: string;
    text?: string;
    placeholder?: string;
    label?: string;
    testId?: string;
    css?: string;
    xpath?: string;
    identifier: string;
  }): Promise<Locator> {
    const strategies: (() => Locator)[] = [];

    // Build strategy list based on available options
    if (options.role && options.text) {
      strategies.push(() => this.page.getByRole(options.role as any, { name: options.text }));
    }
    if (options.testId) {
      strategies.push(() => this.page.getByTestId(options.testId!));
    }
    if (options.label) {
      strategies.push(() => this.page.getByLabel(options.label!));
    }
    if (options.placeholder) {
      strategies.push(() => this.page.getByPlaceholder(options.placeholder!));
    }
    if (options.text) {
      strategies.push(() => this.page.getByText(options.text!));
    }
    if (options.css) {
      strategies.push(() => this.page.locator(options.css!));
    }
    if (options.xpath) {
      strategies.push(() => this.page.locator(options.xpath!));
    }

    // Try each strategy
    for (let i = 0; i < strategies.length; i++) {
      try {
        const locator = strategies[i]();
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        if (i > 0) {
          console.log(`✅ Self-healed ${options.identifier} using strategy #${i + 1}`);
        }
        return locator;
      } catch (error) {
        if (i < strategies.length - 1) {
          console.log(`⚠️ Strategy #${i + 1} failed for ${options.identifier}, trying next...`);
        }
      }
    }

    throw new Error(`❌ All strategies failed for ${options.identifier}`);
  }

  /**
   * Find element by multiple text patterns (handles dynamic text)
   */
  async findByText(
    primaryText: string | RegExp,
    fallbackTexts: (string | RegExp)[],
    identifier: string
  ): Promise<Locator> {
    const allTexts = [primaryText, ...fallbackTexts];

    for (const text of allTexts) {
      try {
        const element = this.page.getByText(text);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`✅ Found ${identifier} by text: ${text}`);
        return element;
      } catch (error) {
        continue;
      }
    }

    throw new Error(`❌ Could not find ${identifier} by any text pattern`);
  }

  /**
   * Find input field using multiple strategies
   */
  async findInput(options: {
    type?: string;
    name?: string;
    id?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    identifier: string;
  }): Promise<Locator> {
    const selectors: string[] = [];

    // Build selector list
    if (options.type && options.name) selectors.push(`input[type="${options.type}"][name*="${options.name}"]`);
    if (options.id) selectors.push(`input[id*="${options.id}"]`);
    if (options.name) selectors.push(`input[name*="${options.name}"]`);
    if (options.type) selectors.push(`input[type="${options.type}"]`);
    if (options.placeholder) {
      try {
        const element = this.page.getByPlaceholder(options.placeholder);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }
    if (options.label) {
      try {
        const element = this.page.getByLabel(options.label);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }

    // Try CSS selectors
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`✅ Found input ${options.identifier} using: ${selector}`);
        return element;
      } catch (error) {
        continue;
      }
    }

    throw new Error(`❌ Could not find input ${options.identifier}`);
  }

  /**
   * Find button using multiple strategies
   */
  async findButton(options: {
    text?: string | RegExp;
    type?: string;
    ariaLabel?: string;
    testId?: string;
    identifier: string;
  }): Promise<Locator> {
    // Try role-based first (most stable)
    if (options.text) {
      try {
        const element = this.page.getByRole('button', { name: options.text });
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }

    // Try test ID
    if (options.testId) {
      try {
        const element = this.page.getByTestId(options.testId);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }

    // Try text content
    if (options.text) {
      try {
        const element = this.page.getByText(options.text);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }

    // Try button[type]
    if (options.type) {
      try {
        const element = this.page.locator(`button[type="${options.type}"]`);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {}
    }

    throw new Error(`❌ Could not find button ${options.identifier}`);
  }

  private logSuccess(_identifier: string, _selector: string): void {
    // Optionally log successful locators for analysis
  }

  private updateLocatorHistory(identifier: string, selector: string): void {
    if (!this.locatorHistory.has(identifier)) {
      this.locatorHistory.set(identifier, []);
    }
    this.locatorHistory.get(identifier)!.push(selector);
  }

  /**
   * Get locator history for debugging
   */
  getLocatorHistory(): Map<string, string[]> {
    return this.locatorHistory;
  }
}

/**
 * Helper function to create self-healing locator instance
 */
export function createSelfHealing(page: Page): SelfHealingLocator {
  return new SelfHealingLocator(page);
}
