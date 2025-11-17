# NTDP Front Office Automation

[![CI Status](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/workflows/NTDP%20Portal%20Tests/badge.svg)](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/actions)
[![Testing](https://img.shields.io/badge/Testing-Playwright-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)

> **Comprehensive automated test suite for NTDP Portal using Playwright with TypeScript**

## Features

- ✅ **Multi-Browser Support** - Chromium, Firefox, WebKit compatibility
- ✅ **Page Object Model** - Maintainable and scalable test architecture
- ✅ **Comprehensive Reporting** - HTML reports with screenshots and videos
- ✅ **CI/CD Ready** - Optimized GitHub Actions workflows
- ✅ **Network Resilience** - Retry logic and timeout handling
- ✅ **Performance Monitoring** - Test execution metrics and analysis

---

## Project Structure

```text
ntdp-frontoffice-automation/
├── .github/workflows/          # CI/CD pipeline configurations
├── pages/                      # Page Object Model classes
│   ├── LoginPage.ts            # Login page interactions
│   └── DashboardPage.ts        # Dashboard page validation
├── tests/                      # Test specifications
│   ├── ci-friendly.spec.ts     # CI-optimized functional tests
│   └── login-single.spec.ts    # Single login validation
├── utils/                      # Helper functions and utilities
├── testData/                   # Test data and credentials
├── test-results/               # Test execution artifacts
├── playwright-report/          # HTML test reports
└── playwright.config.ts        # Playwright configuration
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/UsamaArshadJadoon/NTDPFrontOffice.git
cd NTDPFrontOffice

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Application Under Test
BASE_URL=https://portal-uat.ntdp-sa.com

# Test Credentials (Do NOT commit real credentials)
SAUDI_ID=your-saudi-id
PASSWORD=your-password
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in all browsers
npm run test:all

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui

# View test report
npm run test:report
```

### CI/CD Commands

```bash
# Run tests with CI reporters
npm run test:ci

# Run specific browser in CI
npm run test:ci:chromium
npm run test:ci:firefox
npm run test:ci:webkit
```

---

## Test Architecture

### Page Object Model

The framework uses the **Page Object Model (POM)** pattern for maintainability:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(saudiId: string, password: string) {
    await this.enterSaudiId(saudiId);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
```

### Test Structure

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('123456789', 'password');
  await expect(page).toHaveURL(/dashboard/);
});
```

---

## CI/CD Integration

### GitHub Actions

The project includes optimized GitHub Actions workflows:

- **Parallel execution** across multiple browsers
- **Artifact retention** for failed tests
- **HTML report generation** and upload
- **Environment-based configuration**

### Workflow Files

- `.github/workflows/playwright.yml` - Main test execution
- Automatic retries for flaky tests
- Screenshot and video capture on failure

---

## Configuration

### Playwright Config

Key configuration options in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 90000,                    // 90 seconds per test
  retries: process.env.CI ? 1 : 0,  // Retry once in CI
  workers: process.env.CI ? 1 : 2,  // Parallel workers
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

---

## Test Reports

### HTML Reports

After running tests, view the interactive HTML report:

```bash
npm run test:report
```

The report includes:

- ✅ Test execution timeline
- 📸 Screenshots on failure
- 🎥 Video recordings
- 📊 Test statistics
- 🔍 Detailed error traces

### CI Reports

In CI/CD, reports are generated in multiple formats:

- **HTML** - Interactive web report
- **JUnit** - For CI/CD integration
- **JSON** - For custom processing

---

## Best Practices

### 1. Test Independence

Each test should be independent and able to run in any order:

```typescript
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto('/');
});
```

### 2. Robust Selectors

Use stable, semantic selectors:

```typescript
// ✅ Good - Semantic selectors
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Saudi ID').fill('123456789');

// ❌ Avoid - Brittle selectors
await page.click('#btn-123');
await page.fill('.form-input-0');
```

### 3. Explicit Waits

Wait for specific conditions:

```typescript
// Wait for element to be visible
await expect(page.getByText('Welcome')).toBeVisible();

// Wait for navigation
await page.waitForURL('**/dashboard');

// Wait for network idle
await page.waitForLoadState('networkidle');
```

### 4. Error Handling

Implement retry logic for flaky operations:

```typescript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await page.goto('/login');
    break;
  } catch (error) {
    if (attempt === 3) throw error;
    await page.waitForTimeout(2000);
  }
}
```

---

## Troubleshooting

### Common Issues

#### Tests Fail in Headless Mode

```bash
# Run in headed mode to debug
npm run test:headed
```

#### Network Timeout Errors

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  navigationTimeout: 60000,  // 60 seconds
  actionTimeout: 30000,      // 30 seconds
}
```

#### Screenshots Not Captured

Ensure configuration has:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

---

## Contributing

### Development Workflow

1. Create a feature branch
2. Write tests following existing patterns
3. Run tests locally: `npm test`
4. Commit with clear messages
5. Open a pull request

### Code Quality

```bash
# Run linter
npm run lint

# Type checking
npm run type-check
```

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

## License

ISC License

---

## Support

For issues or questions:

- Open a [GitHub Issue](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/issues)
- Check existing documentation
- Review Playwright's official guides

---

### Built with ❤️ using Playwright and TypeScript
