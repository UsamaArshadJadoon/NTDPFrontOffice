# Self-Healing Quick Reference

## Import and Setup

```typescript
import { createSelfHealing } from '../utils/SelfHealingLocator';

class YourPage {
  private selfHealing: ReturnType<typeof createSelfHealing>;
  
  constructor(page: Page) {
    this.page = page;
    this.selfHealing = createSelfHealing(page);
  }
}
```

## Finding Elements

### Smart Locator (Recommended)
```typescript
const element = await this.selfHealing.smartLocator({
  role: 'button',           // W3C role
  text: 'Submit',           // Text content or regex
  testId: 'submit-btn',     // data-testid
  label: 'Submit button',   // aria-label
  css: '.submit-button',    // CSS selector
  xpath: '//button[@type="submit"]', // XPath
  identifier: 'SubmitButton' // For logging
});
```

### Input Fields
```typescript
const input = await this.selfHealing.findInput({
  type: 'text',             // input type
  name: 'username',         // name attribute
  id: 'user-input',         // id attribute
  placeholder: 'Enter username', // placeholder
  label: 'Username',        // associated label
  ariaLabel: 'Username input',   // aria-label
  identifier: 'UsernameInput'
});
```

### Buttons
```typescript
const button = await this.selfHealing.findButton({
  text: /submit|send|login/i, // Text or regex
  type: 'submit',             // type attribute
  ariaLabel: 'Submit form',   // aria-label
  testId: 'submit-btn',       // data-testid
  identifier: 'SubmitButton'
});
```

### Custom Element
```typescript
const element = await this.selfHealing.findElement(
  'primary-selector',              // Try first
  ['fallback-1', 'fallback-2'],    // Then these
  'ElementIdentifier'              // For logging
);
```

### By Text
```typescript
const element = await this.selfHealing.findByText(
  'Primary Text',                   // Exact match
  [/pattern 1/i, 'Fallback Text'],  // Alternatives
  'TextElement'                     // Identifier
);
```

## Page Object Pattern

### Basic Structure
```typescript
export class MyPage {
  private selfHealing: ReturnType<typeof createSelfHealing>;

  constructor(private page: Page) {
    this.selfHealing = createSelfHealing(page);
  }

  // Private getters for elements
  private async getSubmitButton(): Promise<Locator> {
    return this.selfHealing.findButton({
      text: /submit|send/i,
      testId: 'submit',
      identifier: 'SubmitButton'
    });
  }

  // Public action methods
  async submit(): Promise<void> {
    const button = await this.getSubmitButton();
    await button.click();
  }
}
```

## Selector Priority (Most → Least Stable)

1. **data-testid** - Most stable, designed for testing
2. **role + accessible name** - W3C standard, accessible
3. **label associations** - Semantic HTML
4. **placeholder text** - User-visible, less likely to change
5. **CSS classes/IDs** - Can change with styling
6. **XPath** - Brittle, last resort

## Console Output

### Success (Primary)
```
// No output - primary selector worked
```

### Success (Fallback)
```
⚠️ Primary selector failed for LoginButton: button.login-btn
✅ Self-healed LoginButton using: button[type="submit"]
```

### Failure (All)
```
⚠️ Primary selector failed for LoginButton: button.login-btn
⚠️ Fallback selector failed for LoginButton: button[type="submit"]
⚠️ Strategy #1 failed for LoginButton, trying next...
❌ All selectors failed for LoginButton
```

## Best Practices

### ✅ DO
- Provide multiple fallback strategies
- Use descriptive identifiers
- Order by stability (testid → role → css)
- Use regex for flexible text matching
- Keep selectors semantic

### ❌ DON'T
- Rely on single strategy
- Use generic identifiers ('btn1')
- Use overly specific selectors
- Depend solely on CSS classes
- Skip the identifier parameter

## Common Patterns

### Login Form
```typescript
private async getUsernameInput() {
  return this.selfHealing.findInput({
    type: 'text',
    name: 'username',
    placeholder: 'Username',
    label: 'Username',
    identifier: 'UsernameInput'
  });
}

private async getPasswordInput() {
  return this.selfHealing.findInput({
    type: 'password',
    name: 'password',
    placeholder: 'Password',
    label: 'Password',
    identifier: 'PasswordInput'
  });
}

private async getLoginButton() {
  return this.selfHealing.findButton({
    text: /login|sign in/i,
    type: 'submit',
    testId: 'login-btn',
    identifier: 'LoginButton'
  });
}
```

### Navigation Menu
```typescript
private async getMenuItem(name: string) {
  return this.selfHealing.smartLocator({
    role: 'link',
    text: name,
    css: `a[href*="${name.toLowerCase()}"]`,
    identifier: `${name}MenuItem`
  });
}
```

### Search Box
```typescript
private async getSearchInput() {
  return this.selfHealing.findInput({
    type: 'search',
    placeholder: /search/i,
    ariaLabel: /search/i,
    name: 'q',
    identifier: 'SearchInput'
  });
}
```

## Timeout Configuration

Default timeout per strategy: **5 seconds**

Modify in `SelfHealingLocator.ts`:
```typescript
await element.waitFor({ 
  state: 'visible', 
  timeout: 5000  // Adjust here
});
```

## Debugging

Enable verbose output:
```bash
DEBUG=true npm test
```

Or add console logs in your test:
```typescript
test('debug self-healing', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Console will show which strategies succeeded/failed
  await loginPage.goto();
  await loginPage.enterSaudiId('123456789');
});
```

## Migration Guide

### Before (Brittle)
```typescript
export class LoginPage {
  readonly usernameInput: Locator;
  
  constructor(page: Page) {
    this.usernameInput = page.locator('#username');
  }
  
  async enterUsername(name: string) {
    await this.usernameInput.fill(name);
  }
}
```

### After (Self-Healing)
```typescript
export class LoginPage {
  private selfHealing: ReturnType<typeof createSelfHealing>;
  
  constructor(page: Page) {
    this.page = page;
    this.selfHealing = createSelfHealing(page);
  }
  
  private async getUsernameInput() {
    return this.selfHealing.findInput({
      id: 'username',
      name: 'username',
      label: 'Username',
      identifier: 'UsernameInput'
    });
  }
  
  async enterUsername(name: string) {
    const input = await this.getUsernameInput();
    await input.fill(name);
  }
}
```

## Performance Tips

1. **Order matters** - Put most likely selectors first
2. **Reduce strategies** - Only add what's necessary
3. **Adjust timeouts** - Lower for frequently found elements
4. **Cache results** - Store locator if used multiple times
5. **Profile tests** - Monitor which fallbacks trigger most

## Testing Your Self-Healing

```typescript
test('verify self-healing adapts', async ({ page }) => {
  // 1. Change primary selector in your app
  // 2. Run test - should still pass via fallback
  // 3. Check console for self-healing messages
  
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.enterSaudiId('123456789');
  
  // Should succeed even with changed selectors
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Element not found | Add more fallback strategies |
| Wrong element selected | Make selectors more specific |
| Tests too slow | Reduce timeout, optimize order |
| Too many fallbacks | Remove rarely-used strategies |
| No self-healing logs | Check console/terminal output |

## See Also

- [Full Documentation](./SELF-HEALING.md)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Example Tests](../tests/self-healing-demo.spec.ts)
