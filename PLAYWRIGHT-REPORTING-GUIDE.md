# Playwright Reporting Commands Guide

## 📊 Built-in Reporter Options

### 1. **HTML Reporter** (Recommended for detailed analysis)
```bash
npx playwright test --reporter=html
npx playwright show-report  # Opens the HTML report in browser
```
**Features:**
- ✅ Interactive visual report with screenshots
- ✅ Test timeline and execution details
- ✅ Error traces and stack traces
- ✅ Video recordings for failed tests
- ✅ Filterable by test status, browser, project

### 2. **List Reporter** (Good for CI/CD logs)
```bash
npx playwright test --reporter=list
```
**Features:**
- ✅ Clean, concise output
- ✅ Shows test progress in real-time
- ✅ Perfect for terminal/CI environments

### 3. **Line Reporter** (Minimal output)
```bash
npx playwright test --reporter=line
```
**Features:**
- ✅ Single line per test
- ✅ Fastest for quick runs

### 4. **Dot Reporter** (Ultra-minimal)
```bash
npx playwright test --reporter=dot
```
**Features:**
- ✅ Just dots (. = pass, F = fail)
- ✅ Very compact output

### 5. **JSON Reporter** (For programmatic analysis)
```bash
npx playwright test --reporter=json
npx playwright test --reporter=json --output-dir=reports
```
**Features:**
- ✅ Machine-readable test results
- ✅ Perfect for integrating with other tools
- ✅ Can be processed by custom scripts

### 6. **JUnit Reporter** (For CI/CD integration)
```bash
npx playwright test --reporter=junit
npx playwright test --reporter=junit --output-dir=test-results
```
**Features:**
- ✅ Standard XML format
- ✅ Compatible with Jenkins, Azure DevOps, GitHub Actions
- ✅ Test result integration in CI platforms

## 🔧 Advanced Reporting Commands

### **Multiple Reporters** (Combine different outputs)
```bash
# HTML + JUnit for CI/CD
npx playwright test --reporter=html,junit

# List + JSON for development
npx playwright test --reporter=list,json

# All three for comprehensive reporting
npx playwright test --reporter=html,junit,json
```

### **Custom Output Directories**
```bash
# Specify custom report location
npx playwright test --reporter=html --output-dir=custom-reports

# Multiple reporters with custom paths
npx playwright test --reporter=html,junit --output-dir=reports
```

### **Filtered Reporting**
```bash
# Run specific test files with HTML report
npx playwright test tests/security-ci.spec.ts --reporter=html

# Run tests matching pattern
npx playwright test --grep "security" --reporter=html

# Run only failed tests from last run
npx playwright test --last-failed --reporter=html
```

## 🎯 Specialized Reporting Commands

### **Coverage Reports** (If configured)
```bash
npx playwright test --reporter=html --coverage
```

### **Slow Test Analysis**
```bash
# Show slowest tests
npx playwright test --reporter=list --slow-test-threshold=30000
```

### **Parallel Execution with Reports**
```bash
# Run tests in parallel with HTML report
npx playwright test --workers=4 --reporter=html
```

### **Headed Mode with Reports**
```bash
# Run with browser visible + HTML report
npx playwright test --headed --reporter=html
```

## 🔍 Report Analysis Commands

### **View Generated Reports**
```bash
# Open HTML report (after running)
npx playwright show-report

# Open specific HTML report
npx playwright show-report path/to/playwright-report

# Serve report on custom port
npx playwright show-report --port 3000
```

### **Report File Locations**
- **HTML Reports:** `playwright-report/index.html`
- **JSON Reports:** `test-results.json`
- **JUnit Reports:** `test-results/junit.xml`
- **Screenshots:** `test-results/`
- **Videos:** `test-results/`

## 🚀 CI/CD Optimized Commands

### **GitHub Actions**
```bash
# Recommended for GitHub Actions
npx playwright test --reporter=html,junit --output-dir=test-results
```

### **Azure DevOps**
```bash
# Azure DevOps integration
npx playwright test --reporter=junit --output-dir=$(Agent.TempDirectory)/test-results
```

### **Jenkins**
```bash
# Jenkins compatible
npx playwright test --reporter=junit,html --output-dir=reports
```

## 📊 Your Current Project Reports

Based on your test execution, here are the reports generated:

### **Security Reports** 📋
- Location: `test-results/security/*.md`
- Content: OWASP Top 10 analysis, vulnerability findings
- Screenshots: `test-results/security/*.png`

### **HTML Report** 🌐
- Run: `npx playwright show-report`
- Features: Interactive test results, screenshots, videos
- Status: Generated with 30/30 tests passing

### **Security Assessment Summaries** 🔒
- Pre-login scan: 6 medium risk issues
- Post-login scan: 6 medium risk issues
- OWASP compliance validation completed

## 🎯 Recommended Commands for Your Project

### **Development Testing**
```bash
# Quick test with visual report
npx playwright test tests/ci-friendly.spec.ts --reporter=html

# Security tests only
npx playwright test tests/security-ci.spec.ts --reporter=list
```

### **CI/CD Pipeline**
```bash
# Full suite for GitHub Actions
npx playwright test --reporter=html,junit --output-dir=test-results

# Just security tests for quick CI
npx playwright test tests/security-ci.spec.ts --reporter=junit
```

### **Security Audits**
```bash
# Comprehensive security testing
npx playwright test tests/security.spec.ts --reporter=html --timeout=300000

# Quick security check
npx playwright test tests/security-ci.spec.ts --reporter=list
```

## 📈 Custom Reporter Configuration

You can also configure reporters in your `playwright.config.ts`:

```typescript
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  // ... other config
});
```

---

**Your project is fully set up with comprehensive reporting capabilities!** 🎉

**Current Status:**
- ✅ 30/30 tests passing
- ✅ HTML report available (`npx playwright show-report`)
- ✅ Security reports generated automatically
- ✅ CI/CD ready with multiple reporter formats