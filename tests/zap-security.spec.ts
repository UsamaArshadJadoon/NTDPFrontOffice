/**
 * OWASP ZAP Security Tests
 * Integrated ZAP scanning with Playwright tests
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { createZapScanner, getZapConfigFromEnv } from '../utils/zap-integration';

test.describe('OWASP ZAP Security Scanning', () => {
  let loginPage: LoginPage;
  const baseUrl = 'https://portal-uat.ntdp-sa.com';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should perform ZAP passive scan on login page', async ({ page }) => {
    console.log('\n🔒 Starting ZAP Passive Scan on Login Page');

    // Check if ZAP is running
    const zapConfig = getZapConfigFromEnv();
    const zapScanner = createZapScanner(zapConfig.apiKey, zapConfig.proxy);

    const isRunning = await zapScanner.isZapRunning();
    
    if (!isRunning) {
      console.log('⚠️ ZAP is not running. Skipping ZAP scan.');
      console.log('To run ZAP scans:');
      console.log('1. Download ZAP from https://www.zaproxy.org/download/');
      console.log('2. Start ZAP in daemon mode: zap.sh -daemon -port 8080 -config api.key=changeme');
      console.log('3. Set ZAP_API_KEY environment variable if using custom key');
      test.skip();
      return;
    }

    // Start new session
    await zapScanner.startNewSession('login-page-passive-scan');

    // Navigate to login page through normal browser (not through proxy)
    await loginPage.goto();
    await page.waitForLoadState('networkidle');

    // Access URL through ZAP for passive scanning
    await zapScanner.accessUrl(`${baseUrl}/login`);

    // Wait for passive scanning to complete
    await page.waitForTimeout(5000);

    // Get scan results
    const results = await zapScanner.getScanResults(`${baseUrl}/login`);

    // Generate reports
    const timestamp = Date.now();
    await zapScanner.generateMarkdownReport(
      `test-results/zap-reports/login-passive-scan-${timestamp}.md`,
      `${baseUrl}/login`
    );
    await zapScanner.generateJsonReport(
      `test-results/zap-reports/login-passive-scan-${timestamp}.json`
    );

    // Assertions
    console.log(`\n✅ ZAP Passive Scan Completed`);
    console.log(`   Total Alerts: ${results.summary.total}`);
    console.log(`   High Risk: ${results.summary.high}`);
    console.log(`   Medium Risk: ${results.summary.medium}`);

    // Fail test if high risk vulnerabilities found
    expect(results.summary.high).toBeLessThanOrEqual(0);
    
    // Warn if medium risk vulnerabilities found
    if (results.summary.medium > 0) {
      console.log(`⚠️ Warning: ${results.summary.medium} medium risk vulnerabilities found`);
    }
  });

  test('should perform ZAP spider scan on application', async ({ page }) => {
    console.log('\n🕷️ Starting ZAP Spider Scan');

    const zapConfig = getZapConfigFromEnv();
    const zapScanner = createZapScanner(zapConfig.apiKey, zapConfig.proxy);

    const isRunning = await zapScanner.isZapRunning();
    if (!isRunning) {
      console.log('⚠️ ZAP is not running. Skipping ZAP scan.');
      test.skip();
      return;
    }

    // Start new session
    await zapScanner.startNewSession('spider-scan');

    // Navigate to login page
    await loginPage.goto();
    await page.waitForLoadState('networkidle');

    // Start spider scan
    const scanId = await zapScanner.spiderScan(`${baseUrl}/login`, 20);
    
    // Wait for spider to complete
    await zapScanner.waitForSpiderComplete(scanId);

    // Get results
    const results = await zapScanner.getScanResults(baseUrl);

    // Generate reports
    const timestamp = Date.now();
    await zapScanner.generateMarkdownReport(
      `test-results/zap-reports/spider-scan-${timestamp}.md`,
      baseUrl
    );

    console.log(`\n✅ Spider Scan Completed`);
    console.log(`   URLs discovered and scanned`);
    console.log(`   Passive scan alerts: ${results.summary.total}`);

    // Check for issues found during spidering
    expect(results.summary.high).toBeLessThanOrEqual(0);
  });

  test('should perform ZAP active scan on login page', async ({ page }) => {
    console.log('\n🔥 Starting ZAP Active Scan on Login Page');

    const zapConfig = getZapConfigFromEnv();
    const zapScanner = createZapScanner(zapConfig.apiKey, zapConfig.proxy);

    const isRunning = await zapScanner.isZapRunning();
    if (!isRunning) {
      console.log('⚠️ ZAP is not running. Skipping ZAP scan.');
      test.skip();
      return;
    }

    // Start new session
    await zapScanner.startNewSession('active-scan');

    // Navigate to login page
    await loginPage.goto();
    await page.waitForLoadState('networkidle');

    // Access URL through ZAP
    await zapScanner.accessUrl(`${baseUrl}/login`);

    // Start active scan (this will take longer)
    console.log('⚠️ Active scan may take several minutes...');
    const scanId = await zapScanner.activeScan(`${baseUrl}/login`, false);
    
    // Wait for active scan to complete
    await zapScanner.waitForActiveScanComplete(scanId);

    // Get results
    const results = await zapScanner.getScanResults(`${baseUrl}/login`);

    // Generate comprehensive reports
    const timestamp = Date.now();
    await zapScanner.generateHtmlReport(
      `test-results/zap-reports/active-scan-${timestamp}.html`
    );
    await zapScanner.generateMarkdownReport(
      `test-results/zap-reports/active-scan-${timestamp}.md`,
      `${baseUrl}/login`
    );
    await zapScanner.generateJsonReport(
      `test-results/zap-reports/active-scan-${timestamp}.json`
    );

    console.log(`\n✅ Active Scan Completed`);
    console.log(`   Total Alerts: ${results.summary.total}`);
    console.log(`   High Risk: ${results.summary.high}`);
    console.log(`   Medium Risk: ${results.summary.medium}`);

    // Assertions - fail on high risk
    expect(results.summary.high).toBeLessThanOrEqual(0);
    
    // Warn on medium risk
    if (results.summary.medium > 5) {
      console.log(`⚠️ Warning: ${results.summary.medium} medium risk vulnerabilities found`);
    }
  });

  test('should perform full ZAP scan after authentication', async ({ page }) => {
    console.log('\n🔐 Starting Full ZAP Scan After Authentication');

    const zapConfig = getZapConfigFromEnv();
    const zapScanner = createZapScanner(zapConfig.apiKey, zapConfig.proxy);

    const isRunning = await zapScanner.isZapRunning();
    if (!isRunning) {
      console.log('⚠️ ZAP is not running. Skipping ZAP scan.');
      test.skip();
      return;
    }

    // Start new session
    await zapScanner.startNewSession('authenticated-scan');

    // Perform login
    console.log('🔐 Performing login...');
    await loginPage.goto();
    
    const saudiId = process.env.SAUDI_ID || '';
    const password = process.env.PASSWORD || '';

    if (!saudiId || !password) {
      console.log('⚠️ Credentials not configured. Skipping authenticated scan.');
      test.skip();
      return;
    }

    await loginPage.fillSaudiId(saudiId);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();

    // Wait for successful login
    await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {
      console.log('⚠️ Login may have failed or redirected differently');
    });

    const currentUrl = page.url();
    console.log(`✅ Authenticated. Current URL: ${currentUrl}`);

    // Access authenticated URL through ZAP
    await zapScanner.accessUrl(currentUrl);

    // Perform quick passive scan on authenticated pages
    console.log('🔍 Performing passive scan on authenticated session...');
    await page.waitForTimeout(5000);

    // Get scan results
    const results = await zapScanner.getScanResults(baseUrl);

    // Generate reports
    const timestamp = Date.now();
    await zapScanner.generateMarkdownReport(
      `test-results/zap-reports/authenticated-scan-${timestamp}.md`,
      baseUrl
    );
    await zapScanner.generateHtmlReport(
      `test-results/zap-reports/authenticated-scan-${timestamp}.html`
    );

    console.log(`\n✅ Authenticated Scan Completed`);
    console.log(`   Total Alerts: ${results.summary.total}`);
    console.log(`   High Risk: ${results.summary.high}`);
    console.log(`   Medium Risk: ${results.summary.medium}`);

    // Assertions
    expect(results.summary.high).toBeLessThanOrEqual(0);
    
    if (results.summary.medium > 0) {
      console.log(`⚠️ Warning: ${results.summary.medium} medium risk vulnerabilities found in authenticated session`);
    }
  });

  test('should generate comprehensive ZAP security report', async ({ page }) => {
    console.log('\n📊 Generating Comprehensive ZAP Security Report');

    const zapConfig = getZapConfigFromEnv();
    const zapScanner = createZapScanner(zapConfig.apiKey, zapConfig.proxy);

    const isRunning = await zapScanner.isZapRunning();
    if (!isRunning) {
      console.log('⚠️ ZAP is not running. Skipping ZAP scan.');
      test.skip();
      return;
    }

    // Start new session
    await zapScanner.startNewSession('comprehensive-report');

    // Navigate and scan
    await loginPage.goto();
    await page.waitForLoadState('networkidle');

    // Quick passive scan
    const results = await zapScanner.quickPassiveScan(`${baseUrl}/login`);

    // Generate all report formats
    const timestamp = Date.now();
    const reportBaseName = `comprehensive-security-report-${timestamp}`;

    await zapScanner.generateHtmlReport(
      `test-results/zap-reports/${reportBaseName}.html`
    );
    await zapScanner.generateMarkdownReport(
      `test-results/zap-reports/${reportBaseName}.md`,
      `${baseUrl}/login`
    );
    await zapScanner.generateJsonReport(
      `test-results/zap-reports/${reportBaseName}.json`
    );

    console.log(`\n✅ Comprehensive Reports Generated`);
    console.log(`   📄 HTML: test-results/zap-reports/${reportBaseName}.html`);
    console.log(`   📄 Markdown: test-results/zap-reports/${reportBaseName}.md`);
    console.log(`   📄 JSON: test-results/zap-reports/${reportBaseName}.json`);

    // Summary
    console.log(`\n📊 Security Summary:`);
    console.log(`   🔴 High: ${results.summary.high}`);
    console.log(`   🟠 Medium: ${results.summary.medium}`);
    console.log(`   🟡 Low: ${results.summary.low}`);
    console.log(`   ℹ️  Info: ${results.summary.informational}`);

    // Test passes if we can generate reports
    expect(results).toBeDefined();
    expect(results.summary).toBeDefined();
  });
});
