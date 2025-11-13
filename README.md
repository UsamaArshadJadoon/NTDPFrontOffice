# 🏢 NTDP Front Office Automation

[![CI Status](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/workflows/NTDP%20Portal%20Tests/badge.svg)](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/actions)
[![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010-green)](https://owasp.org/Top10/)
[![Testing](https://img.shields.io/badge/Testing-Playwright-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)

> **Comprehensive automated test suite for NTDP Portal using Playwright with TypeScript, featuring advanced security testing and OWASP Top 10 compliance validation.**

## 🌟 Features

- 🔐 **Complete Security Testing** - OWASP Top 10 vulnerability assessment
- 🚀 **Multi-Browser Support** - Chromium, Firefox, WebKit compatibility
- 🏗️ **Page Object Model** - Maintainable and scalable test architecture
- 📊 **Comprehensive Reporting** - HTML reports with screenshots and videos
- 🔄 **CI/CD Ready** - Optimized GitHub Actions workflows
- 🛡️ **Network Resilience** - Retry logic and timeout handling
- 📈 **Performance Monitoring** - Test execution metrics and analysis

---

## 📁 Project Structure

```
ntdp-frontoffice-automation/
├── 📁 .github/workflows/          # CI/CD pipeline configurations
├── 📁 pages/                      # Page Object Model classes
│   ├── LoginPage.ts              # Login page interactions
│   └── DashboardPage.ts          # Dashboard page validation
├── 📁 tests/                     # Test specifications
│   ├── ci-friendly.spec.ts       # CI-optimized functional tests
│   ├── security-ci.spec.ts       # Fast security assessment
│   ├── security.spec.ts          # Comprehensive OWASP testing
│   └── login-single.spec.ts      # Single login validation
├── 📁 utils/                     # Helper functions and utilities
├── 📁 testData/                  # Test data and credentials
├── 📁 docs/                      # Documentation and guides
├── 📁 test-results/              # Test execution artifacts
├── 📁 playwright-report/         # HTML test reports
└── 📄 playwright.config.ts       # Playwright configuration
```

## Features

---

## 🧪 Test Categories

### 1. 🔐 Security Testing Suite
**Comprehensive OWASP Top 10 Coverage**

| Test Category | Tests | Coverage |
|---------------|-------|----------|
| **Pre-login Security** | 6 tests | Authentication, Headers, HTTPS |
| **Post-login Security** | 6 tests | Session, Authorization, Data |
| **OWASP Top 10** | 10 tests | Complete vulnerability assessment |
| **Injection Testing** | 3 tests | SQL injection, XSS, Command injection |
| **Security Headers** | 5 tests | CSP, HSTS, X-Frame-Options, etc. |

### 2. ⚡ CI-Friendly Tests
**Optimized for fast CI/CD execution**

- Multi-browser compatibility testing
- Network resilience validation
- Timeout and retry logic
- Login flow verification
- Element interaction testing

### 3. 🎯 Functional Tests
**Core application functionality**

- User authentication flows
- Dashboard navigation
- Form validation
- Error handling
- Success scenarios

---

## 🚀 Quick Start

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

# 4. Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

```env
# Application Configuration
BASE_URL=https://portal-uat.ntdp-sa.com
SAUDI_ID=1111111111
EXPECTED_NAME=Dummy

# Security Testing (Optional)
ZAP_BASE_URL=http://localhost:8080
ZAP_API_KEY=your-zap-api-key
```

---

## 🎮 Usage

### Essential Commands

```bash
# 🚀 Quick test run (Chromium only)
npm test

# 🌐 All browsers
npm run test:all

# 👀 Visual mode (headed)
npm run test:headed

# 🐛 Debug mode
npm run test:debug

# 🎨 Interactive UI
npm run test:ui

# 📊 Generate reports
npm run test:report
```

### Specialized Testing

```bash
# 🔐 Security Testing
npm run test:security                    # Full security suite
npm run test:security:basic             # Basic security scan
npm run test:security:owasp             # OWASP Top 10 tests
npm run test:security:vulnerabilities   # Vulnerability testing

# ⚡ CI-Optimized
npm run test:ci                         # CI with reports
npm run test:ci:chromium               # Chromium only
npm run test:ci:firefox                # Firefox only
npm run test:ci:webkit                 # WebKit only
```

### Development Commands

```bash
# 🔍 Code quality
npm run lint                            # ESLint check
npm run type-check                      # TypeScript validation

# 📦 Installation
npm run install:ci                      # CI environment setup
```

---

## 🛡️ Security Testing

### OWASP Top 10 2021 Coverage

| OWASP Category | Status | Tests | Risk Level |
|----------------|--------|-------|------------|
| **A01** - Broken Access Control | ✅ Covered | 4 tests | Medium |
| **A02** - Cryptographic Failures | ✅ Covered | 3 tests | Medium |
| **A03** - Injection | ✅ Covered | 5 tests | Low |
| **A04** - Insecure Design | ✅ Covered | 2 tests | Low |
| **A05** - Security Misconfiguration | ✅ Covered | 6 tests | Medium |
| **A06** - Vulnerable Components | ✅ Covered | 2 tests | Low |
| **A07** - Authentication Failures | ✅ Covered | 4 tests | Low |
| **A08** - Data Integrity Failures | ✅ Covered | 2 tests | Low |
| **A09** - Logging Failures | ✅ Covered | 2 tests | Low |
| **A10** - Server-Side Request Forgery | ✅ Covered | 2 tests | Low |

### Security Test Features

- **🔍 Automated Vulnerability Scanning**
- **🍪 Cookie Security Analysis** 
- **🔒 HTTPS Protocol Validation**
- **🛡️ Security Header Verification**
- **💉 Injection Attack Testing**
- **📸 Screenshot Evidence Collection**
- **📋 Detailed Security Reports**

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **simple.yml** | Push/PR → main | Essential tests + basic security | ~2-3 min |
| **security-testing.yml** | Manual | Comprehensive OWASP testing | ~15-20 min |
| **snyk-security.yml** | Manual | Dependency vulnerability scan | ~5 min |

### Supported Environments

- ✅ **Ubuntu Latest** (Primary CI environment)
- ✅ **Windows** (Local development)
- ✅ **macOS** (Cross-platform testing)

### Browser Matrix

- 🌐 **Chromium** (Primary)
- 🦊 **Firefox** 
- 🍎 **WebKit** (Safari engine)

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
#   T e s t   r u n   t r i g g e r e d   o n   1 1 / 1 1 / 2 0 2 5   1 8 : 1 2 : 2 8 
 
  
 