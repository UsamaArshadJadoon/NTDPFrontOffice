# OWASP ZAP Integration - Quick Reference

## What is OWASP ZAP?

OWASP ZAP (Zed Attack Proxy) is a free, open-source web application security scanner. It helps find security vulnerabilities in your web applications during development and testing.

## Installation

### Option 1: Using PowerShell Script (Recommended)
```powershell
# Run the automated setup script
.\start-zap.ps1
```

### Option 2: Manual Installation

**Windows:**
```powershell
# Download from https://www.zaproxy.org/download/
# Or install with Chocolatey
choco install zap
```

**Docker (All Platforms):**
```bash
docker run -d -p 8080:8080 \
  -e ZAP_API_KEY=changeme \
  --name zap \
  owasp/zap2docker-stable \
  zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.key=changeme
```

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Update ZAP configuration in `.env`:
   ```env
   ZAP_API_KEY=changeme
   ZAP_PROXY=http://localhost:8080
   ZAP_URL=http://localhost:8080
   ```

## Running ZAP Tests

### Quick Commands

| Command | Description | Duration |
|---------|-------------|----------|
| `npm run test:zap` | All ZAP tests | ~15-20 min |
| `npm run test:zap:passive` | Passive scan (fastest) | ~10 seconds |
| `npm run test:zap:spider` | Spider scan | ~1-2 minutes |
| `npm run test:zap:active` | Active scan (thorough) | ~5-10 minutes |
| `npm run test:zap:full` | Full authenticated scan | ~3-5 minutes |
| `npm run test:zap:report` | Generate comprehensive report | ~15 seconds |

### Step-by-Step Usage

#### 1. Start ZAP
```powershell
# Using the quick start script
.\start-zap.ps1

# Or manually
zap.bat -daemon -port 8080 -config api.key=changeme
```

#### 2. Run a Quick Passive Scan
```bash
npm run test:zap:passive
```

#### 3. Check the Results
Reports are saved in `test-results/zap-reports/`:
- `*.html` - Interactive HTML reports
- `*.md` - Markdown reports (easy to read)
- `*.json` - JSON data (for automation)

## Understanding Results

### Risk Levels

| Level | Icon | Action |
|-------|------|--------|
| High | 🔴 | **Fix immediately** - Critical security issues |
| Medium | 🟠 | **Fix before production** - Important security concerns |
| Low | 🟡 | **Consider fixing** - Minor security improvements |
| Info | ℹ️ | **Optional** - Best practice recommendations |

### Common Findings

1. **Missing Security Headers** (Medium/Low)
   - Add X-Frame-Options, CSP, HSTS headers
   - Easy to fix in web server configuration

2. **Cookie Security Issues** (Medium/Low)
   - Add Secure, HttpOnly, SameSite flags
   - Requires backend changes

3. **SQL Injection** (High)
   - Critical - requires immediate code fix
   - Use parameterized queries

4. **Cross-Site Scripting (XSS)** (High/Medium)
   - Sanitize user input
   - Implement proper output encoding

## Test Types Explained

### 1. Passive Scan (⚡ Fast)
- **What it does**: Analyzes HTTP traffic without attacking
- **When to use**: Daily development, CI/CD pipeline
- **Impact**: No impact on application
- **Command**: `npm run test:zap:passive`

### 2. Spider Scan (🕷️ Medium)
- **What it does**: Crawls the application to discover all pages
- **When to use**: Weekly or before releases
- **Impact**: Generates traffic but no attacks
- **Command**: `npm run test:zap:spider`

### 3. Active Scan (🔥 Thorough)
- **What it does**: Actively tests for vulnerabilities with attack payloads
- **When to use**: Before production deployment, staging environment
- **Impact**: May trigger security alerts, generates significant traffic
- **Command**: `npm run test:zap:active`
- **⚠️ Warning**: Never run on production!

### 4. Full Authenticated Scan (🔐 Comprehensive)
- **What it does**: Tests security after login
- **When to use**: Complete security assessment
- **Impact**: Tests protected areas of application
- **Command**: `npm run test:zap:full`

## Integration with CI/CD

### GitHub Actions

The ZAP workflow runs automatically:
- **Daily**: Scheduled passive scan at 2 AM UTC
- **Manual**: Trigger any scan type from Actions tab
- **Pull Requests**: Optional PR comments with results

### Running Manually in GitHub

1. Go to **Actions** tab
2. Select **OWASP ZAP Security Scan**
3. Click **Run workflow**
4. Choose scan type
5. Click **Run workflow**

## Viewing Reports

### Local Development
```bash
# Open HTML report in browser
start test-results/zap-reports/[latest-report].html

# View Markdown report
type test-results/zap-reports/[latest-report].md
```

### CI/CD
1. Go to workflow run
2. Scroll to **Artifacts** section
3. Download `zap-security-reports-*`
4. Extract and open HTML reports

## Troubleshooting

### ZAP Not Starting
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process using port (Windows)
taskkill /PID [PID] /F

# Restart ZAP
.\start-zap.ps1
```

### Tests Failing
1. Verify ZAP is running: `curl http://localhost:8080`
2. Check ZAP API key matches `.env` file
3. Review test output for specific errors
4. Check ZAP logs for issues

### No Reports Generated
1. Check `test-results/zap-reports/` directory exists
2. Verify test completed successfully
3. Check for file permissions issues
4. Review Playwright test output

## Best Practices

### Development
- ✅ Run **passive scans** frequently (daily)
- ✅ Use **spider scans** weekly
- ✅ Run **active scans** before major releases
- ❌ Don't run active scans on production

### CI/CD
- ✅ Automate passive scans on every commit
- ✅ Schedule comprehensive scans nightly
- ✅ Fail builds on high-risk findings
- ✅ Archive and track scan results

### Security
- ✅ Keep ZAP API key secure
- ✅ Use environment variables for credentials
- ✅ Review and act on findings promptly
- ✅ Document remediation actions

## Next Steps

1. **Start ZAP**: Run `.\start-zap.ps1`
2. **Run First Scan**: Execute `npm run test:zap:passive`
3. **Review Results**: Check `test-results/zap-reports/`
4. **Fix Issues**: Address high and medium risk findings
5. **Automate**: Set up CI/CD integration

## Resources

- **Full Documentation**: [docs/ZAP-INTEGRATION.md](ZAP-INTEGRATION.md)
- **ZAP Website**: https://www.zaproxy.org/
- **OWASP Top 10**: https://owasp.org/Top10/
- **ZAP API Docs**: https://www.zaproxy.org/docs/api/

## Support

For help:
1. Check [docs/ZAP-INTEGRATION.md](ZAP-INTEGRATION.md)
2. Review test output and ZAP logs
3. Visit ZAP community forum
4. Check GitHub issues

---

**Happy Security Testing! 🔒**
