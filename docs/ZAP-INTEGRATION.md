# OWASP ZAP Integration Guide

## Overview
This test framework includes comprehensive OWASP ZAP (Zed Attack Proxy) integration for automated security testing. ZAP is an open-source web application security scanner maintained by OWASP.

## Prerequisites

### 1. Install OWASP ZAP

**Windows:**
```powershell
# Download from https://www.zaproxy.org/download/
# Or use Chocolatey
choco install zap
```

**Linux:**
```bash
# Download from https://www.zaproxy.org/download/
# Or use package manager
sudo apt-get install zaproxy
```

**macOS:**
```bash
# Download from https://www.zaproxy.org/download/
# Or use Homebrew
brew install --cask owasp-zap
```

### 2. Configure ZAP

**Option 1: Start ZAP in Daemon Mode (Recommended for CI/CD)**
```bash
# Windows
zap.bat -daemon -port 8080 -config api.key=changeme

# Linux/macOS
zap.sh -daemon -port 8080 -config api.key=changeme
```

**Option 2: Start ZAP with GUI**
- Launch ZAP application
- Go to Tools → Options → API
- Enable API and set API key to `changeme` (or your custom key)
- ZAP will listen on `http://localhost:8080`

## Environment Configuration

Create or update your `.env` file:

```env
# OWASP ZAP Configuration
ZAP_API_KEY=changeme
ZAP_PROXY=http://localhost:8080
ZAP_URL=http://localhost:8080

# Application credentials for authenticated scanning
SAUDI_ID=your_saudi_id
PASSWORD=your_password
```

## Running ZAP Security Tests

### Quick Start

```bash
# Run all ZAP security tests
npm run test:zap

# Run specific ZAP test
npm run test:zap:passive    # Passive scan only
npm run test:zap:spider     # Spider scan
npm run test:zap:active     # Active scan (takes longer)
npm run test:zap:full       # Full authenticated scan
```

### Individual Test Execution

```bash
# Passive scan on login page (fast, ~10 seconds)
npx playwright test tests/zap-security.spec.ts --grep "passive scan"

# Spider scan to discover URLs (medium, ~1-2 minutes)
npx playwright test tests/zap-security.spec.ts --grep "spider scan"

# Active scan with attack simulation (slow, ~5-10 minutes)
npx playwright test tests/zap-security.spec.ts --grep "active scan"

# Full authenticated scan (medium, ~3-5 minutes)
npx playwright test tests/zap-security.spec.ts --grep "full ZAP scan"

# Generate comprehensive reports
npx playwright test tests/zap-security.spec.ts --grep "comprehensive"
```

## Test Types

### 1. Passive Scan
- **Speed**: Fast (~10 seconds)
- **Impact**: No impact on application
- **Coverage**: Analyzes HTTP traffic for vulnerabilities
- **Use Case**: Quick security checks, CI/CD pipeline
- **Command**: `npm run test:zap:passive`

### 2. Spider Scan
- **Speed**: Medium (~1-2 minutes)
- **Impact**: Crawls application, generates traffic
- **Coverage**: Discovers URLs and application structure
- **Use Case**: Map application for comprehensive testing
- **Command**: `npm run test:zap:spider`

### 3. Active Scan
- **Speed**: Slow (~5-10 minutes)
- **Impact**: Sends attack payloads, may trigger alerts
- **Coverage**: Tests for vulnerabilities actively
- **Use Case**: Thorough security assessment, pre-production
- **Command**: `npm run test:zap:active`

### 4. Authenticated Scan
- **Speed**: Medium (~3-5 minutes)
- **Impact**: Tests authenticated areas
- **Coverage**: Post-login security vulnerabilities
- **Use Case**: Test authenticated application areas
- **Command**: `npm run test:zap:full`

## Report Formats

ZAP integration generates multiple report formats:

### 1. HTML Reports
- **Location**: `test-results/zap-reports/*.html`
- **Features**: Interactive, detailed, browser viewable
- **Best For**: Manual review, sharing with team

### 2. Markdown Reports
- **Location**: `test-results/zap-reports/*.md`
- **Features**: Readable, version control friendly
- **Best For**: Documentation, code reviews, CI/CD

### 3. JSON Reports
- **Location**: `test-results/zap-reports/*.json`
- **Features**: Machine readable, structured data
- **Best For**: Integration with other tools, automated processing

## Understanding ZAP Alerts

### Risk Levels

| Level | Emoji | Description | Action Required |
|-------|-------|-------------|-----------------|
| **High** | 🔴 | Critical vulnerabilities | **Immediate fix required** |
| **Medium** | 🟠 | Moderate security issues | Fix before production |
| **Low** | 🟡 | Minor issues | Consider fixing |
| **Informational** | ℹ️ | Best practices | Optional improvements |

### Common Vulnerabilities Detected

1. **SQL Injection** (High)
   - Tests for database injection flaws
   - OWASP Top 10 #1

2. **Cross-Site Scripting (XSS)** (High/Medium)
   - Tests for script injection
   - OWASP Top 10 #3

3. **Missing Security Headers** (Medium/Low)
   - X-Frame-Options
   - Content-Security-Policy
   - Strict-Transport-Security

4. **Cookie Security** (Medium/Low)
   - Secure flag missing
   - HttpOnly flag missing
   - SameSite attribute

5. **Sensitive Data Exposure** (High/Medium)
   - Passwords in URLs
   - Sensitive data in responses

## CI/CD Integration

### GitHub Actions

```yaml
name: ZAP Security Scan

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        
      - name: Start OWASP ZAP
        run: |
          docker run -d -p 8080:8080 \
            -e ZAP_API_KEY=changeme \
            owasp/zap2docker-stable \
            zap.sh -daemon -host 0.0.0.0 -port 8080 \
            -config api.key=changeme
          
      - name: Wait for ZAP to start
        run: sleep 30
        
      - name: Run ZAP Security Tests
        env:
          ZAP_API_KEY: changeme
          ZAP_PROXY: http://localhost:8080
          SAUDI_ID: ${{ secrets.SAUDI_ID }}
          PASSWORD: ${{ secrets.PASSWORD }}
        run: npm run test:zap
        
      - name: Upload ZAP Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: zap-reports
          path: test-results/zap-reports/
          
      - name: Stop ZAP
        if: always()
        run: docker stop $(docker ps -q --filter ancestor=owasp/zap2docker-stable)
```

### Docker Integration

```bash
# Start ZAP in Docker
docker run -d -p 8080:8080 \
  -e ZAP_API_KEY=changeme \
  --name zap \
  owasp/zap2docker-stable \
  zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.key=changeme

# Run tests
npm run test:zap

# Stop ZAP
docker stop zap && docker rm zap
```

## Troubleshooting

### ZAP Not Running

**Error**: "ZAP is not running or not accessible"

**Solutions**:
1. Verify ZAP is running: `curl http://localhost:8080`
2. Check ZAP logs for errors
3. Ensure port 8080 is not in use: `netstat -an | findstr 8080` (Windows) or `lsof -i :8080` (Linux/Mac)
4. Restart ZAP in daemon mode

### API Key Mismatch

**Error**: "API key incorrect or not set"

**Solutions**:
1. Verify `ZAP_API_KEY` in `.env` matches ZAP configuration
2. Check ZAP Tools → Options → API → API Key
3. Restart ZAP after changing API key

### Connection Timeout

**Error**: "Connection timeout" or "ECONNREFUSED"

**Solutions**:
1. Increase timeout in `zap-integration.ts`
2. Check firewall settings
3. Verify ZAP proxy address: `ZAP_PROXY=http://localhost:8080`

### Slow Scans

**Issue**: Active scans taking too long

**Solutions**:
1. Use passive scan for quick checks
2. Reduce scan scope with `maxChildren` parameter
3. Configure ZAP attack strength: Tools → Options → Active Scan
4. Use targeted scanning instead of full site scan

## Best Practices

### 1. Development
- Use **passive scans** during development
- Run **spider scans** weekly
- Schedule **active scans** before releases

### 2. CI/CD Pipeline
- Run **passive scans** on every commit
- Run **spider scans** nightly
- Run **active scans** on staging environment
- Generate and archive reports

### 3. Production
- **Never run active scans** on production
- Use passive monitoring only
- Schedule scans during maintenance windows
- Review reports regularly

### 4. Security
- Keep ZAP API key secure
- Don't commit API keys to version control
- Use environment variables for credentials
- Restrict ZAP access in production

## Advanced Usage

### Custom Scan Policies

```typescript
// In your test file
import { createZapScanner } from '../utils/zap-integration';

const zapScanner = createZapScanner('your-api-key', 'http://localhost:8080');

// Configure custom scan policy
await zapScanner.activeScan(targetUrl, true);
```

### Integration with Existing Tests

```typescript
// Add ZAP scanning to existing Playwright tests
import { test } from '@playwright/test';
import { createZapScanner } from '../utils/zap-integration';

test('existing test with ZAP', async ({ page }) => {
  const zapScanner = createZapScanner();
  
  // Your existing test code
  await page.goto('https://example.com');
  
  // Add ZAP scan
  await zapScanner.quickPassiveScan('https://example.com');
  const results = await zapScanner.getScanResults();
  
  // Continue with your test
});
```

## Resources

- **OWASP ZAP Documentation**: https://www.zaproxy.org/docs/
- **ZAP API Documentation**: https://www.zaproxy.org/docs/api/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **ZAP GitHub**: https://github.com/zaproxy/zaproxy
- **Community Forum**: https://groups.google.com/group/zaproxy-users

## Support

For issues with:
- **ZAP Integration**: Check this guide and ZAP documentation
- **Test Failures**: Review ZAP reports in `test-results/zap-reports/`
- **Configuration**: Verify `.env` settings and ZAP status
- **CI/CD**: Check GitHub Actions logs and ZAP container logs

---

**Last Updated**: November 2025
**ZAP Version**: 2.14.0+
**Framework**: Playwright + TypeScript + OWASP ZAP
