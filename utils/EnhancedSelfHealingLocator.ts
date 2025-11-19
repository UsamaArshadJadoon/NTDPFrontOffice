import { Page, Locator } from '@playwright/test';

/**
 * Enhanced Self-Healing Locator with AI-like capabilities
 * Integrates machine learning patterns and visual similarity
 */

interface LocatorStrategy {
  name: string;
  selector: string;
  priority: number;
  lastUsed?: Date;
  successRate: number;
}

interface ElementFingerprint {
  tag: string;
  attributes: Record<string, string>;
  textContent?: string;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
}

export class EnhancedSelfHealingLocator {
  private page: Page;
  private strategyHistory: Map<string, LocatorStrategy[]> = new Map();
  private elementFingerprints: Map<string, ElementFingerprint> = new Map();
  private aiLearningEnabled: boolean = false;

  constructor(page: Page, options?: { enableAILearning?: boolean }) {
    this.page = page;
    this.aiLearningEnabled = options?.enableAILearning || false;
  }

  /**
   * Enhanced smart locator with learning capabilities
   */
  async smartLocatorWithLearning(options: {
    role?: string;
    text?: string | RegExp;
    placeholder?: string;
    label?: string;
    testId?: string;
    css?: string;
    xpath?: string;
    identifier: string;
    visualSimilarity?: boolean;
  }): Promise<Locator> {
    const strategies = this.buildStrategies(options);
    
    // Sort strategies by success rate and recency
    const sortedStrategies = this.getSortedStrategies(options.identifier, strategies);
    
    // Try strategies in order of likelihood to succeed
    for (const strategy of sortedStrategies) {
      try {
        const locator = strategy.locatorFn();
        await locator.waitFor({ state: 'visible', timeout: 3000 });
        
        // Record successful strategy
        this.recordSuccess(options.identifier, strategy);
        
        // Learn element characteristics for future use
        if (this.aiLearningEnabled) {
          await this.learnElementCharacteristics(options.identifier, locator);
        }
        
        if (strategy.priority > 0) {
          console.log(`✅ Self-healed ${options.identifier} using: ${strategy.name}`);
        }
        
        return locator;
      } catch (error) {
        this.recordFailure(options.identifier, strategy);
        continue;
      }
    }

    // If all standard strategies fail, try AI-based recovery
    if (this.aiLearningEnabled) {
      const aiLocator = await this.tryAIRecovery(options.identifier);
      if (aiLocator) {
        console.log(`🤖 AI-recovered ${options.identifier}`);
        return aiLocator;
      }
    }

    // Final fallback: Use original self-healing logic
    console.log(`🔄 Falling back to original self-healing for ${options.identifier}`);
    try {
      const { SelfHealingLocator } = require('./SelfHealingLocator');
      const originalSelfHealing = new SelfHealingLocator(this.page);
      
      if (options.role && options.text) {
        return await originalSelfHealing.smartLocator({
          role: options.role,
          text: options.text,
          placeholder: options.placeholder,
          label: options.label,
          testId: options.testId,
          css: options.css,
          xpath: options.xpath
        });
      } else {
        return await originalSelfHealing.findInput({
          type: 'text',
          identifier: options.identifier,
          placeholder: options.placeholder,
          name: options.label
        });
      }
    } catch (fallbackError) {
      throw new Error(`❌ All strategies failed for ${options.identifier}: Enhanced and original both failed`);
    }
  }

  /**
   * Build strategy list with dynamic prioritization
   */
  private buildStrategies(options: any): Array<{ name: string; locatorFn: () => Locator; priority: number }> {
    const strategies = [];

    if (options.testId) {
      strategies.push({
        name: `testId: ${options.testId}`,
        locatorFn: () => this.page.getByTestId(options.testId),
        priority: 0 // Highest priority
      });
    }

    if (options.role && options.text) {
      strategies.push({
        name: `role: ${options.role} with text: ${options.text}`,
        locatorFn: () => this.page.getByRole(options.role as any, { name: options.text }),
        priority: 1
      });
    }

    if (options.label) {
      strategies.push({
        name: `label: ${options.label}`,
        locatorFn: () => this.page.getByLabel(options.label),
        priority: 2
      });
    }

    if (options.placeholder) {
      strategies.push({
        name: `placeholder: ${options.placeholder}`,
        locatorFn: () => this.page.getByPlaceholder(options.placeholder),
        priority: 3
      });
    }

    if (options.text) {
      strategies.push({
        name: `text: ${options.text}`,
        locatorFn: () => this.page.getByText(options.text),
        priority: 4
      });
    }

    if (options.css) {
      strategies.push({
        name: `css: ${options.css}`,
        locatorFn: () => this.page.locator(options.css),
        priority: 5
      });
    }

    if (options.xpath) {
      strategies.push({
        name: `xpath: ${options.xpath}`,
        locatorFn: () => this.page.locator(options.xpath),
        priority: 6
      });
    }

    return strategies;
  }

  /**
   * Get strategies sorted by success rate and recency
   */
  private getSortedStrategies(identifier: string, strategies: any[]): any[] {
    // Get strategy history for intelligent ordering
    // const history = this.strategyHistory.get(identifier) || [];
    
    return strategies.map(strategy => ({
      ...strategy,
      successRate: this.getSuccessRate(identifier, strategy.name),
      lastUsed: this.getLastUsed(identifier, strategy.name)
    })).sort((a, b) => {
      // Sort by success rate, then by recency, then by original priority
      if (a.successRate !== b.successRate) {
        return b.successRate - a.successRate;
      }
      if (a.lastUsed && b.lastUsed) {
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      }
      return a.priority - b.priority;
    });
  }

  /**
   * Enhanced input finding with learning
   */
  async findInputWithLearning(options: {
    type?: string;
    name?: string;
    id?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    identifier: string;
  }): Promise<Locator> {
    console.log(`🔍 Finding input with learning: ${options.identifier}`);
    // Try learned patterns first
    const learnedLocator = await this.tryLearnedPattern(options.identifier);
    if (learnedLocator) {
      try {
        await learnedLocator.waitFor({ state: 'visible', timeout: 2000 });
        console.log(`🧠 Used learned pattern for ${options.identifier}`);
        return learnedLocator;
      } catch (error) {
        // Learned pattern failed, continue with standard strategies
      }
    }

    // Fallback to enhanced smart locator
    return this.smartLocatorWithLearning({
      ...options,
      role: 'textbox'
    });
  }

  /**
   * Visual similarity matching (basic implementation)
   */
  async findByVisualSimilarity(identifier: string, _referenceScreenshot?: Buffer): Promise<Locator | null> {
    if (!this.aiLearningEnabled) return null;

    const fingerprint = this.elementFingerprints.get(identifier);
    if (!fingerprint) return null;

    // Try to find elements with similar characteristics
    const candidates = await this.page.locator('*').all();
    
    for (const candidate of candidates) {
      try {
        const candidateInfo = await this.getElementFingerprint(candidate);
        if (this.isSimilarElement(fingerprint, candidateInfo)) {
          await candidate.waitFor({ state: 'visible', timeout: 1000 });
          return candidate;
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  /**
   * AI-based recovery attempt
   */
  private async tryAIRecovery(identifier: string): Promise<Locator | null> {
    // Try visual similarity
    const visualMatch = await this.findByVisualSimilarity(identifier);
    if (visualMatch) return visualMatch;

    // Try attribute-based matching
    const attributeMatch = await this.findByAttributeSimilarity(identifier);
    if (attributeMatch) return attributeMatch;

    // Try position-based matching
    const positionMatch = await this.findByPositionalContext(identifier);
    if (positionMatch) return positionMatch;

    return null;
  }

  /**
   * Learn element characteristics for future use
   */
  private async learnElementCharacteristics(identifier: string, locator: Locator): Promise<void> {
    try {
      const fingerprint = await this.getElementFingerprint(locator);
      this.elementFingerprints.set(identifier, fingerprint);
    } catch (error) {
      // Learning failed, continue silently
    }
  }

  /**
   * Get element fingerprint for learning
   */
  private async getElementFingerprint(locator: Locator): Promise<ElementFingerprint> {
    const element = await locator.elementHandle();
    if (!element) throw new Error('Element not found');

    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    const attributes = await element.evaluate(el => {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attrs[attr.name] = attr.value;
      }
      return attrs;
    });
    
    const textContent = await element.evaluate(el => el.textContent?.trim());
    const boundingBox = await locator.boundingBox();

    return {
      tag: tagName,
      attributes,
      textContent: textContent || undefined,
      position: boundingBox ? { x: boundingBox.x, y: boundingBox.y } : undefined,
      dimensions: boundingBox ? { width: boundingBox.width, height: boundingBox.height } : undefined
    };
  }

  /**
   * Check if two elements are similar
   */
  private isSimilarElement(reference: ElementFingerprint, candidate: ElementFingerprint): boolean {
    // Tag must match
    if (reference.tag !== candidate.tag) return false;

    // Check key attributes
    const keyAttrs = ['id', 'class', 'name', 'type', 'role', 'data-testid'];
    let attributeMatches = 0;
    
    for (const attr of keyAttrs) {
      if (reference.attributes[attr] && candidate.attributes[attr]) {
        if (reference.attributes[attr] === candidate.attributes[attr]) {
          attributeMatches++;
        }
      }
    }

    // Text content similarity
    const textSimilar = reference.textContent === candidate.textContent;

    // Position similarity (within reasonable bounds)
    const positionSimilar = reference.position && candidate.position ?
      Math.abs(reference.position.x - candidate.position.x) < 50 &&
      Math.abs(reference.position.y - candidate.position.y) < 50 : false;

    return attributeMatches >= 2 || textSimilar || positionSimilar;
  }

  /**
   * Try learned pattern for element
   */
  private async tryLearnedPattern(identifier: string): Promise<Locator | null> {
    const fingerprint = this.elementFingerprints.get(identifier);
    if (!fingerprint) return null;

    // Build selector from learned characteristics
    let selector = fingerprint.tag;
    
    if (fingerprint.attributes.id) {
      selector += `#${fingerprint.attributes.id}`;
    } else if (fingerprint.attributes.class) {
      const mainClass = fingerprint.attributes.class.split(' ')[0];
      selector += `.${mainClass}`;
    }

    try {
      return this.page.locator(selector);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find by attribute similarity
   */
  private async findByAttributeSimilarity(identifier: string): Promise<Locator | null> {
    const fingerprint = this.elementFingerprints.get(identifier);
    if (!fingerprint) return null;

    // Try variations of learned attributes
    const variations = [
      `${fingerprint.tag}[class*="${fingerprint.attributes.class?.split(' ')[0] || ''}"]`,
      `${fingerprint.tag}[type="${fingerprint.attributes.type || ''}"]`,
      `${fingerprint.tag}[name*="${fingerprint.attributes.name || ''}"]`
    ];

    for (const variation of variations) {
      if (variation.includes('""')) continue;
      
      try {
        const locator = this.page.locator(variation).first();
        await locator.waitFor({ state: 'visible', timeout: 1000 });
        return locator;
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  /**
   * Find by positional context
   */
  private async findByPositionalContext(identifier: string): Promise<Locator | null> {
    const fingerprint = this.elementFingerprints.get(identifier);
    if (!fingerprint?.position) return null;

    // Look for elements in similar positions
    const elements = await this.page.locator(fingerprint.tag).all();
    
    for (const element of elements) {
      try {
        const boundingBox = await element.boundingBox();
        if (boundingBox && 
            Math.abs(boundingBox.x - fingerprint.position.x) < 100 &&
            Math.abs(boundingBox.y - fingerprint.position.y) < 100) {
          await element.waitFor({ state: 'visible', timeout: 1000 });
          return element;
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  /**
   * Record strategy success
   */
  private recordSuccess(identifier: string, strategy: any): void {
    const history = this.strategyHistory.get(identifier) || [];
    const existing = history.find(s => s.name === strategy.name);
    
    if (existing) {
      existing.successRate = Math.min(1.0, existing.successRate + 0.1);
      existing.lastUsed = new Date();
    } else {
      history.push({
        name: strategy.name,
        selector: '',
        priority: strategy.priority,
        successRate: 0.8,
        lastUsed: new Date()
      });
    }
    
    this.strategyHistory.set(identifier, history);
  }

  /**
   * Record strategy failure
   */
  private recordFailure(identifier: string, strategy: any): void {
    const history = this.strategyHistory.get(identifier) || [];
    const existing = history.find(s => s.name === strategy.name);
    
    if (existing) {
      existing.successRate = Math.max(0.0, existing.successRate - 0.05);
    }
  }

  private getSuccessRate(identifier: string, strategyName: string): number {
    const history = this.strategyHistory.get(identifier) || [];
    const strategy = history.find(s => s.name === strategyName);
    return strategy?.successRate || 0.5;
  }

  private getLastUsed(identifier: string, strategyName: string): Date | undefined {
    const history = this.strategyHistory.get(identifier) || [];
    const strategy = history.find(s => s.name === strategyName);
    return strategy?.lastUsed;
  }

  /**
   * Export learning data for persistence
   */
  exportLearningData(): string {
    return JSON.stringify({
      strategies: Object.fromEntries(this.strategyHistory),
      fingerprints: Object.fromEntries(this.elementFingerprints)
    });
  }

  /**
   * Import learning data from persistence
   */
  importLearningData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.strategyHistory = new Map(Object.entries(parsed.strategies || {}));
      this.elementFingerprints = new Map(Object.entries(parsed.fingerprints || {}));
    } catch (error) {
      console.warn('Failed to import learning data:', error);
    }
  }
}

/**
 * Create enhanced self-healing locator with AI capabilities
 */
export function createEnhancedSelfHealing(page: Page, options?: { enableAILearning?: boolean }) {
  return new EnhancedSelfHealingLocator(page, options);
}

// Re-export original for backward compatibility
// Note: Import from SelfHealingLocator when needed
// export { SelfHealingLocator, createSelfHealing } from './SelfHealingLocator';