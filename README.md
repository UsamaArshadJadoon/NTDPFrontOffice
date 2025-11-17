# NTDP Front Office Automation

[![CI Status](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/workflows/NTDP%20Portal%20Tests/badge.svg)](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/actions)
[![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010-green)](https://owasp.org/Top10/)
[![Testing](https://img.shields.io/badge/Testing-Playwright-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)

> **Comprehensive automated test suite for NTDP Portal using Playwright with TypeScript, featuring advanced security testing and OWASP Top 10 compliance validation.**

## Features

- **Complete Security Testing**- OWASP Top 10 vulnerability assessment
- **Multi-Browser Support**- Chromium, Firefox, WebKit compatibility
- **Page Object Model**- Maintainable and scalable test architecture
- **Comprehensive Reporting**- HTML reports with screenshots and videos
- **CI/CD Ready**- Optimized GitHub Actions workflows
- **Network Resilience**- Retry logic and timeout handling
- **Performance Monitoring**- Test execution metrics and analysis

---

## Project Structure

```text
ntdp-frontoffice-automation/
  .github/workflows/          # CI/CD pipeline configurations
  pages/                      # Page Object Model classes
    LoginPage.ts              # Login page interactions
    DashboardPage.ts          # Dashboard page validation
  tests/                     # Test specifications
    ci-friendly.spec.ts       # CI-optimized functional tests
    security-ci.spec.ts       # Fast security assessment
    security.spec.ts          # Comprehensive OWASP testing
    login-single.spec.ts      # Single login validation
  utils/                     # Helper functions and utilities
  testData/                  # Test data and credentials
  docs/                      # Documentation and guides
  test-results/              # Test execution artifacts
  playwright-report/         # HTML test reports
  playwright.config.ts       # Playwright configuration
```

---

## Test Categories

### 1.  Security Testing Suite

#### Comprehensive OWASP Top 10 Coverage

| Test Category | Tests | Coverage |
|---------------|-------|----------|
| **Pre-login Security**| 6 tests | Authentication, Headers, HTTPS |
| **Post-login Security**| 6 tests | Session, Authorization, Data |
| **OWASP Top 10**| 10 tests | Complete vulnerability assessment |
| **Injection Testing**| 3 tests | SQL injection, XSS, Command injection |
| **Security Headers**| 5 tests | CSP, HSTS, X-Frame-Options, etc. |

### 2.  CI-Friendly Tests

#### Optimized for fast CI/CD execution

- Multi-browser compatibility testing
- Network resilience validation
- Timeout and retry logic
- Login flow verification
- Element interaction testing

### 3.  Functional Tests

#### Core application functionality

- User authentication flows
- Dashboard navigation
- Form validation
- Error handling
- Success scenarios

---

## Quick Start

### Prerequisites

- **Node.js**18+
- **npm**or **yarn**
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

## Usage

### Essential Commands

```bash
# Quick test run (Chromium only)
npm test

# All browsers
npm run test:all

# Visual mode (headed)
npm run test:headed

# Debug mode
npm run test:debug

# Interactive UI
npm run test:ui

# Generate reports
npm run test:report
```

### Specialized Testing

```bash
# Security Testing
npm run test:security                    # Full security suite
npm run test:security:basic             # Basic security scan
npm run test:security:owasp             # OWASP Top 10 tests
npm run test:security:vulnerabilities   # Vulnerability testing

# CI-Optimized
npm run test:ci                         # CI with reports
npm run test:ci:chromium               # Chromium only
npm run test:ci:firefox                # Firefox only
npm run test:ci:webkit                 # WebKit only
```

### Development Commands

```bash
# Code quality
npm run lint                            # ESLint check
npm run type-check                      # TypeScript validation

# Installation
npm run install:ci                      # CI environment setup
```

---

## Security Testing

### OWASP Top 10 2021 Coverage

| OWASP Category | Status | Tests | Risk Level |
|----------------|--------|-------|------------|
| **A01**- Broken Access Control |  Covered | 4 tests | Medium |
| **A02**- Cryptographic Failures |  Covered | 3 tests | Medium |
| **A03**- Injection |  Covered | 5 tests | Low |
| **A04**- Insecure Design |  Covered | 2 tests | Low |
| **A05**- Security Misconfiguration |  Covered | 6 tests | Medium |
| **A06**- Vulnerable Components |  Covered | 2 tests | Low |
| **A07**- Authentication Failures |  Covered | 4 tests | Low |
| **A08**- Data Integrity Failures |  Covered | 2 tests | Low |
| **A09**- Logging Failures |  Covered | 2 tests | Low |
| **A10**- Server-Side Request Forgery |  Covered | 2 tests | Low |

### Security Test Features

- **Automated Vulnerability Scanning**
- **OWASP ZAP Integration** - Comprehensive security scanning
- **Cookie Security Analysis**
- **HTTPS Protocol Validation**
- **Security Header Verification**
- **Injection Attack Testing**
- **Screenshot Evidence Collection**
- **Detailed Security Reports** (HTML, JSON, Markdown)

---

## OWASP ZAP Integration

This framework includes **comprehensive OWASP ZAP (Zed Attack Proxy)** integration for automated security testing.

### Quick Start with ZAP

```bash
# Start ZAP (automated script)
.\start-zap.ps1

# Run ZAP security tests
npm run test:zap              # All ZAP tests
npm run test:zap:passive      # Quick passive scan (~10s)
npm run test:zap:spider       # Spider scan (~1-2min)
npm run test:zap:active       # Active scan (~5-10min)
npm run test:zap:full         # Full authenticated scan
```

### ZAP Features

- **Passive Scanning** - Non-intrusive security analysis
- **Active Scanning** - Attack simulation and penetration testing
- **Spider Scanning** - Application mapping and discovery
- **Authenticated Testing** - Post-login security assessment
- **Multiple Report Formats** - HTML, JSON, Markdown
- **CI/CD Integration** - Docker support for pipelines

For detailed ZAP setup and usage, see [ZAP Integration Guide](docs/ZAP-INTEGRATION.md).

---

## CI/CD Integration

### GitHub Actions Workflows

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **simple.yml**| Push/PR  main | Essential tests + basic security | ~2-3 min |
| **security-testing.yml**| Manual | Comprehensive OWASP testing | ~15-20 min |
| **ZAP Security Scan** | Schedule/Manual | OWASP ZAP automated scanning | ~10-15 min |

### Supported Environments

- **Ubuntu Latest**(Primary CI environment)
- **Windows**(Local development)
- **macOS**(Cross-platform testing)

### Browser Matrix

- **Chromium**(Primary)
- **Firefox**
- **WebKit**(Safari engine)

---

## Reporting & Analytics

### Test Reports

#### HTML Reports

- **Interactive test results**with filtering
- **Screenshots**for failed tests
- **Video recordings**of test execution
- **Performance metrics**and timing
- **Error traces**with stack information

#### Security Reports

- **OWASP Top 10 assessment**with risk ratings
- **Vulnerability findings**with remediation steps
- **Security header analysis**
- **Cookie security evaluation**
- **Compliance status**reporting

#### CI Reports

- **JUnit XML**for CI integration
- **Test result summaries**
- **Artifact collection**
- **Failure analysis**

### Generated Artifacts

```text
test-results/
  security/               # Security assessment reports
    security-scan-*.md    # Detailed findings
    *.png                 # Security screenshots
  screenshots/           # Failure screenshots
  videos/               # Test execution videos
  traces/               # Debug traces
```

---

## Architecture

### Page Object Model Implementation

```typescript
// LoginPage.ts - Clean, maintainable page interactions
export class LoginPage {
  private page: Page;
  
  // Locators
  private saudiIdInput = 'input[name="saudiId"]';
  private loginButton = 'button[type="submit"]';
  
  // Actions
  async goto(): Promise<void>
  async enterSaudiId(saudiId: string): Promise<void>
  async clickLogin(): Promise<void>
  async waitForPageLoad(): Promise<void>
  async hasLoginError(): Promise<boolean>
}
```

### Test Data Management

```typescript
// Centralized test data
export const testData = {
  validCredentials: {
    saudiId: process.env.SAUDI_ID || '1111111111',
    expectedName: process.env.EXPECTED_NAME || 'Dummy'
  },
  
  securityPayloads: {
    sqlInjection: ["1' OR '1'='1", "'; DROP TABLE users;--"],
    xss: ["<script>alert('XSS')</script>", "javascript:alert(1)"]
  }
};
```

---

## Performance Metrics

### Current Test Statistics

| Metric | Value | Target |
|--------|-------|--------|
| **Total Tests**| 30 | - |
| **Success Rate**| 100% | >95% |
| **Execution Time**| ~5 min | <10 min |
| **Coverage**| OWASP Top 10 | 100% |
| **Browsers**| 3 | 3 |
| **Security Issues**| 6 (Medium) | 0 (High) |

### Performance Optimization

- **Parallel Execution**- Multiple tests run simultaneously
- **Smart Retries**- Automatic retry on network failures
- **Artifact Optimization**- Efficient screenshot/video capture
- **CI Caching**- Dependency and browser caching

---

## Troubleshooting

### Common Issues & Solutions

#### Network Timeouts

```bash
# Issue: Tests failing due to network timeouts
# Solution: Increase timeout values
npx playwright test --timeout=120000
```

#### Element Not Found

```bash
# Issue: Selectors not working after UI changes
# Solution: Update page object selectors
# Check browser developer tools for current selectors
```

#### Security Test Failures

```bash
# Issue: Security tests reporting false positives
# Solution: Review security configuration
# Check server security headers and HTTPS setup
```

### Debug Tools

```bash
# Debug specific test
npx playwright test tests/login-single.spec.ts --debug

# Record test execution
npx playwright test --headed --video=on

# Generate trace
npx playwright test --trace=on
```

---

## Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Write** tests following existing patterns
4. **Run** full test suite (`npm run test:all`)
5. **Update** documentation
6. **Submit** pull request

### Code Standards

- **TypeScript**for type safety
- **ESLint**configuration compliance
- **Page Object Model**pattern
- **Comprehensive test coverage**
- **Security-first approach**

### Commit Convention

```bash
feat: add new security test for XSS validation
fix: resolve timeout issue in CI environment
docs: update README with new test commands
test: add comprehensive OWASP A01 coverage
```

---

## Current Security Assessment

### Security Status

| Risk Level | Count | Status |
|------------|-------|---------|
|  **High**| 0 |  Clean |
|  **Medium**| 6 |  Review Required |
|  **Low**| 0 |  Clean |

### Remediation Recommendations

1. **Security Headers**
   - Implement `X-Frame-Options: DENY`
   - Add `Content-Security-Policy`
   - Configure `Strict-Transport-Security`

2. **Cookie Security**
   - Add `Secure` flag for HTTPS cookies
   - Implement `HttpOnly` for session cookies
   - Configure proper `SameSite` attributes

3. **Access Control**
   - Review unauthorized access paths
   - Implement proper authentication checks
   - Add authorization middleware

---

## Documentation

### Additional Resources

- [**Playwright Documentation**](https://playwright.dev/) - Official Playwright docs
- [**OWASP Top 10**](https://owasp.org/Top10/) - Security vulnerability guide
- [**TypeScript Handbook**](https://www.typescriptlang.org/docs/) - TypeScript reference

### Project Documentation

- [**Test Execution Report**](./TEST-EXECUTION-REPORT.md) - Detailed test results
- [**Security Assessment**](./docs/security-assessment.md) - Security findings
- [**CI/CD Guide**](./docs/ci-cd-setup.md) - Pipeline configuration
- [**Troubleshooting Guide**](./docs/troubleshooting.md) - Common issues

---

## License

This project is licensed under the **ISC License**- see the [LICENSE](LICENSE) file for details.

---

## Support

### Getting Help

1. **Documentation** - Check existing docs and guides
2. **Issues** - Search existing GitHub issues
3. **Discussions** - Community support and questions
4. **Bug Reports** - Create detailed issue with reproduction steps

### Contact

- **Repository**: [UsamaArshadJadoon/NTDPFrontOffice](https://github.com/UsamaArshadJadoon/NTDPFrontOffice)
- **Issues**: [GitHub Issues](https://github.com/UsamaArshadJadoon/NTDPFrontOffice/issues)

---

**Star this repository if it helped you!**

![Test Status](https://img.shields.io/badge/Tests-30%20Passing-brightgreen)
![Security](https://img.shields.io/badge/Security-OWASP%20Compliant-green)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

---

**Last Updated**: November 2025 | **Framework**: Playwright + TypeScript | **Security**: OWASP Top 10 2021
