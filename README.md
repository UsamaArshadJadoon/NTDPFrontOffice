# NTDP Front Office Automation

Automated test suite for NTDP Portal using Playwright with TypeScript and Page Object Model design pattern.

## Project Structure

```
NTDPFrontOfficeAutomation/
├── pages/                      # Page Object Models
│   ├── LoginPage.ts           # Login page actions and locators
│   └── DashboardPage.ts       # Dashboard page actions and locators
├── tests/                      # Test specifications
│   └── login.spec.ts          # Login test cases
├── testData/                   # Test data management
│   └── credentials.ts         # User credentials and test data
├── utils/                      # Helper functions
│   └── helpers.ts             # Wait functions and utilities
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## Features

✅ **Page Object Model (POM)** - Maintainable and reusable page classes  
✅ **Proper Wait Strategies** - Explicit waits and network idle checks  
✅ **Type Safety** - Full TypeScript support  
✅ **Test Data Management** - Centralized test data  
✅ **Best Practices** - Following Playwright recommendations  
✅ **Multiple Browsers** - Chrome, Firefox, Safari support  

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Configure environment variables (optional):
   - Copy `.env.example` to `.env`
   - Modify if needed

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Run tests in debug mode:
```bash
npm run test:debug
```

Run tests in UI mode:
```bash
npm run test:ui
```

View test report:
```bash
npm run test:report
```

Run specific test file:
```bash
npx playwright test tests/login.spec.ts
```

## Test Cases

### Login Tests (`tests/login.spec.ts`)

1. **should successfully login with valid Saudi ID**
   - Navigates to login page
   - Enters valid Saudi ID (1111111111)
   - Clicks login button
   - Waits for dashboard to load
   - Verifies welcome message "Welcome Dummy"

2. **should display login page elements correctly**
   - Verifies URL contains "login"
   - Checks Saudi ID input is visible
   - Checks login button is visible

3. **should enter Saudi ID correctly**
   - Enters Saudi ID in input field
   - Verifies input value is correct

4. **should have enabled login button**
   - Verifies login button is visible and enabled

## Page Objects

### LoginPage (`pages/LoginPage.ts`)

**Methods:**
- `goto()` - Navigate to login page
- `waitForPageLoad()` - Wait for page to fully load
- `enterSaudiId(saudiId)` - Enter Saudi ID
- `clickLogin()` - Click login button
- `login(saudiId)` - Complete login flow
- `verifyLoginPageElements()` - Verify page elements

**Locators:**
- `saudiIdInput` - Saudi ID input field
- `loginButton` - Login button

### DashboardPage (`pages/DashboardPage.ts`)

**Methods:**
- `waitForPageLoad()` - Wait for dashboard to load
- `verifyWelcomeMessage(name)` - Verify welcome message
- `verifySuccessfulLogin()` - Verify login success
- `getUserName()` - Get current user name

**Locators:**
- `welcomeHeading` - Welcome heading element
- `mainContent` - Main content area

## Utilities

### helpers.ts (`utils/helpers.ts`)

- `waitForElement()` - Wait for element visibility
- `waitForNetworkIdle()` - Wait for network to be idle
- `waitForNavigation()` - Wait for page navigation
- `waitForUrlChange()` - Wait for URL change
- `waitForUrlNotContaining()` - Wait for URL to not contain pattern
- `waitForCondition()` - Custom wait with retry logic
- `takeScreenshot()` - Capture screenshot with timestamp
- `delay()` - Simple delay function

## Test Data

### credentials.ts (`testData/credentials.ts`)

```typescript
validCredentials = {
  saudiId: '1111111111',
  expectedName: 'Dummy'
}
```

## Configuration

### Playwright Config (`playwright.config.ts`)

- Base URL: `https://portal-uat.ntdp-sa.com`
- Timeout: 15s for actions, 30s for navigation
- Retries: 2 (in CI)
- Screenshots: On failure
- Videos: On failure
- Trace: On first retry

## Credentials

- Saudi ID: 1111111111 (no password required)
- URL: https://portal-uat.ntdp-sa.com/login

## Best Practices Implemented

1. ✅ **Page Object Model** - Separation of test logic and page interactions
2. ✅ **Explicit Waits** - Proper wait strategies for reliable tests
3. ✅ **DRY Principle** - Reusable methods and utilities
4. ✅ **Type Safety** - TypeScript for better code quality
5. ✅ **Test Data Management** - Centralized test data
6. ✅ **Clear Assertions** - Meaningful test verifications
7. ✅ **Network Idle** - Wait for complete page loads
8. ✅ **Element Verification** - Confirm elements before interaction

## Contributing

When adding new tests:
1. Create/update page objects in `pages/` directory
2. Add test data to `testData/` directory
3. Write tests in `tests/` directory
4. Use helper functions from `utils/` for common operations
5. Follow existing naming conventions and patterns
