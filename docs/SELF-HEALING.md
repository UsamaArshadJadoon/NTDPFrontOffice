# Self-Healing Test Framework

## Overview

The self-healing feature automatically adapts when UI elements change, reducing test maintenance by trying multiple strategies to locate elements.

## How It Works

When a primary locator fails, the framework automatically:
1. Tries fallback locators in order
2. Logs which strategy succeeded
3. Continues test execution without failure

## Architecture

### SelfHealingLocator Class

Located in `utils/SelfHealingLocator.ts`, this utility provides methods to find elements using multiple strategies.

#### Key Methods

##### `smartLocator()`
Tries multiple locator strategies automatically:
```typescript
const locator = await selfHealing.smartLocator({
  role: 'button',
  text: 'Login',
  testId: 'login-btn',
  css: '.login-button',
  identifier: 'LoginButton'
});
```

**Strategy order:**
1. Role + Text (most stable)
2. Test ID
3. Label
4. Placeholder
5. Text only
6. CSS selector
7. XPath

##### `findInput()`
Specialized for input fields:
```typescript
const input = await selfHealing.findInput({
  type: 'text',
  name: 'username',
  placeholder: 'Enter username',
  label: 'Username',
  identifier: 'UsernameInput'
});
```

##### `findButton()`
Specialized for buttons:
```typescript
const button = await selfHealing.findButton({
  text: /submit|login/i,
  type: 'submit',
  testId: 'submit-btn',
  identifier: 'SubmitButton'
});
```

##### `findElement()`
Custom locator with explicit fallbacks:
```typescript
const element = await selfHealing.findElement(
  'button.primary',
  ['button[type="submit"]', '.submit-btn', '#submitBtn'],
  'SubmitButton'
);
```

## Page Object Integration

### LoginPage Example

```typescript
import { createSelfHealing } from '../utils/SelfHealingLocator';

export class LoginPage {
  private selfHealing: ReturnType<typeof createSelfHealing>;

  constructor(page: Page) {
    this.page = page;
    this.selfHealing = createSelfHealing(page);
  }

  private async getSaudiIdInput(): Promise<Locator> {
    return this.selfHealing.findInput({
      type: 'text',
      name: 'id',
      placeholder: 'Saudi ID',
      label: 'Saudi ID',
      identifier: 'SaudiIdInput'
    });
  }

  async enterSaudiId(saudiId: string) {
    const input = await this.getSaudiIdInput();
    await input.fill(saudiId);
  }
}
```

### DashboardPage Example

```typescript
export class DashboardPage {
  private async getWelcomeHeading(): Promise<Locator> {
    return this.selfHealing.smartLocator({
      role: 'heading',
      text: 'Welcome',
      css: 'h3.user-name-welcome',
      identifier: 'WelcomeHeading'
    });
  }
}
```

## Benefits

### 1. Reduced Test Maintenance
- Tests adapt to UI changes automatically
- No immediate updates needed when element attributes change
- Longer test stability

### 2. Better Debugging
- Console logs show which strategy succeeded
- Easy to identify when primary selectors fail
- History tracking available

### 3. Multiple Fallback Strategies
- Role-based (most stable per W3C standards)
- Accessibility attributes (labels, placeholders)
- Test IDs
- CSS selectors
- XPath (last resort)

## Console Output

When self-healing occurs:
```
⚠️ Primary selector failed for SaudiIdInput: input[name="saudiId"]
✅ Self-healed SaudiIdInput using: input[placeholder="Saudi ID"]
```

## Best Practices

### 1. Order Strategies by Stability
Most stable → Least stable:
1. `data-testid` attributes
2. Role + accessible name
3. Label associations
4. Placeholder text
5. CSS classes/IDs
6. XPath

### 2. Use Descriptive Identifiers
```typescript
// Good
identifier: 'LoginButton'
identifier: 'SaudiIdInput'

// Bad
identifier: 'btn1'
identifier: 'input'
```

### 3. Provide Multiple Fallbacks
```typescript
// Good - multiple strategies
await selfHealing.findInput({
  type: 'text',
  name: 'username',
  placeholder: 'Enter username',
  label: 'Username',
  identifier: 'UsernameInput'
});

// Bad - single strategy
await selfHealing.findInput({
  name: 'username',
  identifier: 'UsernameInput'
});
```

### 4. Use Regex for Flexible Text Matching
```typescript
await selfHealing.findButton({
  text: /login|sign in|submit/i,  // Matches any variant
  identifier: 'LoginButton'
});
```

## Configuration

### Timeout Settings
Adjust per-strategy timeout in `SelfHealingLocator.ts`:
```typescript
await element.waitFor({ state: 'visible', timeout: 5000 });
```

### Logging
Enable detailed logging by setting environment variable:
```bash
DEBUG=true npm run test
```

## Adding Self-Healing to New Pages

1. **Import the utility:**
```typescript
import { createSelfHealing } from '../utils/SelfHealingLocator';
```

2. **Initialize in constructor:**
```typescript
constructor(page: Page) {
  this.page = page;
  this.selfHealing = createSelfHealing(page);
}
```

3. **Create private getter methods:**
```typescript
private async getElementName(): Promise<Locator> {
  return this.selfHealing.smartLocator({
    // ... strategies
    identifier: 'ElementName'
  });
}
```

4. **Use in public methods:**
```typescript
async clickElement() {
  const element = await this.getElementName();
  await element.click();
}
```

## Testing Self-Healing

Run tests with intentionally changed selectors to verify self-healing:

```typescript
// Change primary selector to force fallback
test('verify self-healing works', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  // Even if primary selector changed, test should pass via fallback
  await loginPage.enterSaudiId('1234567890');
  
  // Check console for self-healing messages
});
```

## Limitations

1. **Performance**: Slightly slower when primary selector fails (tries multiple strategies)
2. **False Positives**: May find wrong element if selectors too generic
3. **Debugging**: Harder to identify exact selector being used

## Future Enhancements

- [ ] AI-based element learning
- [ ] Automatic selector optimization
- [ ] Visual regression integration
- [ ] Selector performance analytics
- [ ] Auto-update test code with successful fallbacks

## Troubleshooting

### Issue: All strategies failing
**Solution**: Add more fallback strategies or verify element exists

### Issue: Wrong element selected
**Solution**: Make selectors more specific, add uniqueness constraints

### Issue: Slow test execution
**Solution**: Reduce timeout per strategy or optimize selector order

## References

- [Playwright Locators](https://playwright.dev/docs/locators)
- [W3C ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [Accessibility Best Practices](https://www.w3.org/WAI/WCAG21/quickref/)
