/**
 * OWASP ZAP Integration Utility
 * Provides methods for integrating ZAP security scanning with Playwright tests
 */

import { ZapClient } from 'zaproxy';
import * as fs from 'fs';
import * as path from 'path';

export interface ZapConfig {
  apiKey: string;
  proxy: string;
  zapUrl?: string;
  timeout?: number;
}

export interface ZapScanResult {
  alerts: ZapAlert[];
  summary: {
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
  reportPath?: string;
}

export interface ZapAlert {
  pluginid: string;
  alert: string;
  name: string;
  riskcode: string;
  confidence: string;
  riskdesc: string;
  desc: string;
  instances: any[];
  count: string;
  solution: string;
  reference: string;
  cweid: string;
  wascid: string;
  sourceid: string;
}

export class ZapScanner {
  private zapClient: ZapClient;
  private config: ZapConfig;
  private scanId: string | null = null;

  constructor(config: ZapConfig) {
    this.config = {
      zapUrl: 'http://localhost:8080',
      timeout: 120000,
      ...config,
    };

    this.zapClient = new ZapClient({
      apiKey: this.config.apiKey,
      proxy: {
        host: this.parseProxyHost(this.config.proxy),
        port: this.parseProxyPort(this.config.proxy),
      },
    });
  }

  /**
   * Parse proxy host from proxy string
   */
  private parseProxyHost(proxy: string): string {
    const match = proxy.match(/https?:\/\/([^:]+)/);
    return match ? match[1] : 'localhost';
  }

  /**
   * Parse proxy port from proxy string
   */
  private parseProxyPort(proxy: string): number {
    const match = proxy.match(/:(\d+)$/);
    return match ? parseInt(match[1]) : 8080;
  }

  /**
   * Check if ZAP is running
   */
  async isZapRunning(): Promise<boolean> {
    try {
      const response = await this.zapClient.core.version();
      console.log(`✅ ZAP is running - Version: ${response.version}`);
      return true;
    } catch (error) {
      console.log('❌ ZAP is not running or not accessible');
      return false;
    }
  }

  /**
   * Start a new ZAP session
   */
  async startNewSession(sessionName: string = 'playwright-session'): Promise<void> {
    try {
      await this.zapClient.core.newSession({
        name: sessionName,
        overwrite: 'true',
      });
      console.log(`✅ New ZAP session started: ${sessionName}`);
    } catch (error) {
      console.error('❌ Failed to start new ZAP session:', error);
      throw error;
    }
  }

  /**
   * Access a URL through ZAP proxy (spider it)
   */
  async accessUrl(url: string): Promise<void> {
    try {
      await this.zapClient.core.accessUrl({ url });
      console.log(`🔍 ZAP accessed URL: ${url}`);
    } catch (error) {
      console.error(`❌ Failed to access URL ${url}:`, error);
      throw error;
    }
  }

  /**
   * Spider scan a target URL
   */
  async spiderScan(targetUrl: string, maxChildren?: number): Promise<string> {
    try {
      const params: any = { url: targetUrl };
      if (maxChildren) {
        params.maxChildren = maxChildren.toString();
      }

      const response = await this.zapClient.spider.scan(params);
      this.scanId = response.scan;
      console.log(`🕷️ Spider scan started for ${targetUrl} - Scan ID: ${this.scanId}`);
      return this.scanId;
    } catch (error) {
      console.error(`❌ Failed to start spider scan for ${targetUrl}:`, error);
      throw error;
    }
  }

  /**
   * Wait for spider scan to complete
   */
  async waitForSpiderComplete(scanId?: string, pollInterval: number = 2000): Promise<void> {
    const id = scanId || this.scanId;
    if (!id) {
      throw new Error('No scan ID available');
    }

    console.log('⏳ Waiting for spider scan to complete...');
    
    let progress = 0;
    while (progress < 100) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      const statusResponse = await this.zapClient.spider.status({ scanId: id });
      progress = parseInt(statusResponse.status);
      process.stdout.write(`\r🕷️ Spider progress: ${progress}%`);
    }
    console.log('\n✅ Spider scan completed');
  }

  /**
   * Start active scan
   */
  async activeScan(targetUrl: string, recurse: boolean = true): Promise<string> {
    try {
      const response = await this.zapClient.ascan.scan({
        url: targetUrl,
        recurse: recurse.toString(),
        inScopeOnly: 'false',
        scanPolicyName: '',
        method: '',
        postData: '',
      });
      
      this.scanId = response.scan;
      console.log(`🔥 Active scan started for ${targetUrl} - Scan ID: ${this.scanId}`);
      return this.scanId;
    } catch (error) {
      console.error(`❌ Failed to start active scan for ${targetUrl}:`, error);
      throw error;
    }
  }

  /**
   * Wait for active scan to complete
   */
  async waitForActiveScanComplete(scanId?: string, pollInterval: number = 3000): Promise<void> {
    const id = scanId || this.scanId;
    if (!id) {
      throw new Error('No scan ID available');
    }

    console.log('⏳ Waiting for active scan to complete...');
    
    let progress = 0;
    while (progress < 100) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      const statusResponse = await this.zapClient.ascan.status({ scanId: id });
      progress = parseInt(statusResponse.status);
      process.stdout.write(`\r🔥 Active scan progress: ${progress}%`);
    }
    console.log('\n✅ Active scan completed');
  }

  /**
   * Get all alerts from ZAP
   */
  async getAlerts(baseUrl?: string): Promise<ZapAlert[]> {
    try {
      const params = baseUrl ? { baseurl: baseUrl } : {};
      const response = await this.zapClient.core.alerts(params);
      return response.alerts || [];
    } catch (error) {
      console.error('❌ Failed to get alerts:', error);
      throw error;
    }
  }

  /**
   * Get scan results with summary
   */
  async getScanResults(baseUrl?: string): Promise<ZapScanResult> {
    const alerts = await this.getAlerts(baseUrl);
    
    const summary = {
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
      total: alerts.length,
    };

    alerts.forEach(alert => {
      const risk = alert.riskdesc.toLowerCase();
      if (risk.includes('high')) summary.high++;
      else if (risk.includes('medium')) summary.medium++;
      else if (risk.includes('low')) summary.low++;
      else summary.informational++;
    });

    console.log('\n📊 ZAP Scan Summary:');
    console.log(`   🔴 High Risk: ${summary.high}`);
    console.log(`   🟠 Medium Risk: ${summary.medium}`);
    console.log(`   🟡 Low Risk: ${summary.low}`);
    console.log(`   ℹ️  Informational: ${summary.informational}`);
    console.log(`   📝 Total Alerts: ${summary.total}`);

    return { alerts, summary };
  }

  /**
   * Generate HTML report
   */
  async generateHtmlReport(outputPath: string): Promise<string> {
    try {
      const response = await this.zapClient.core.htmlreport();
      const reportPath = path.resolve(outputPath);
      
      // Ensure directory exists
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(reportPath, response.html);
      console.log(`📄 HTML report generated: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('❌ Failed to generate HTML report:', error);
      throw error;
    }
  }

  /**
   * Generate JSON report
   */
  async generateJsonReport(outputPath: string): Promise<string> {
    try {
      const scanResults = await this.getScanResults();
      const reportPath = path.resolve(outputPath);
      
      // Ensure directory exists
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const report = {
        generatedAt: new Date().toISOString(),
        summary: scanResults.summary,
        alerts: scanResults.alerts,
      };

      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 JSON report generated: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('❌ Failed to generate JSON report:', error);
      throw error;
    }
  }

  /**
   * Generate Markdown report
   */
  async generateMarkdownReport(outputPath: string, targetUrl: string): Promise<string> {
    try {
      const scanResults = await this.getScanResults(targetUrl);
      const reportPath = path.resolve(outputPath);
      
      // Ensure directory exists
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let markdown = `# OWASP ZAP Security Scan Report\n\n`;
      markdown += `**Target URL**: ${targetUrl}\n`;
      markdown += `**Scan Date**: ${new Date().toISOString()}\n\n`;
      markdown += `## Summary\n\n`;
      markdown += `| Risk Level | Count |\n`;
      markdown += `|------------|-------|\n`;
      markdown += `| 🔴 High | ${scanResults.summary.high} |\n`;
      markdown += `| 🟠 Medium | ${scanResults.summary.medium} |\n`;
      markdown += `| 🟡 Low | ${scanResults.summary.low} |\n`;
      markdown += `| ℹ️ Informational | ${scanResults.summary.informational} |\n`;
      markdown += `| **Total** | **${scanResults.summary.total}** |\n\n`;

      if (scanResults.alerts.length > 0) {
        markdown += `## Detailed Findings\n\n`;
        
        const sortedAlerts = scanResults.alerts.sort((a, b) => {
          const riskOrder: any = { '3': 0, '2': 1, '1': 2, '0': 3 };
          return riskOrder[a.riskcode] - riskOrder[b.riskcode];
        });

        sortedAlerts.forEach((alert, index) => {
          const riskEmoji = alert.riskcode === '3' ? '🔴' : 
                           alert.riskcode === '2' ? '🟠' : 
                           alert.riskcode === '1' ? '🟡' : 'ℹ️';
          
          markdown += `### ${index + 1}. ${riskEmoji} ${alert.alert}\n\n`;
          markdown += `**Risk**: ${alert.riskdesc}\n`;
          markdown += `**Confidence**: ${alert.confidence}\n`;
          markdown += `**CWE ID**: ${alert.cweid || 'N/A'}\n\n`;
          markdown += `**Description**:\n${alert.desc}\n\n`;
          markdown += `**Solution**:\n${alert.solution}\n\n`;
          
          if (alert.instances && alert.instances.length > 0) {
            markdown += `**Instances Found**: ${alert.instances.length}\n\n`;
          }
          
          markdown += `---\n\n`;
        });
      }

      fs.writeFileSync(reportPath, markdown);
      console.log(`📄 Markdown report generated: ${reportPath}`);
      return reportPath;
    } catch (error) {
      console.error('❌ Failed to generate Markdown report:', error);
      throw error;
    }
  }

  /**
   * Perform a quick passive scan
   */
  async quickPassiveScan(targetUrl: string): Promise<ZapScanResult> {
    console.log(`\n🔍 Starting ZAP Quick Passive Scan for: ${targetUrl}`);
    
    // Access the URL to let ZAP observe it
    await this.accessUrl(targetUrl);
    
    // Wait a bit for passive scanning to process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get results
    const results = await this.getScanResults(targetUrl);
    return results;
  }

  /**
   * Perform a full scan (spider + active scan)
   */
  async fullScan(targetUrl: string, generateReports: boolean = true): Promise<ZapScanResult> {
    console.log(`\n🔍 Starting ZAP Full Scan for: ${targetUrl}`);
    
    // Step 1: Spider scan
    const spiderScanId = await this.spiderScan(targetUrl, 10);
    await this.waitForSpiderComplete(spiderScanId);
    
    // Step 2: Active scan
    const activeScanId = await this.activeScan(targetUrl);
    await this.waitForActiveScanComplete(activeScanId);
    
    // Step 3: Get results
    const results = await this.getScanResults(targetUrl);
    
    // Step 4: Generate reports if requested
    if (generateReports) {
      const timestamp = Date.now();
      const reportsDir = path.join(process.cwd(), 'test-results', 'zap-reports');
      
      await this.generateHtmlReport(path.join(reportsDir, `zap-report-${timestamp}.html`));
      await this.generateJsonReport(path.join(reportsDir, `zap-report-${timestamp}.json`));
      await this.generateMarkdownReport(path.join(reportsDir, `zap-report-${timestamp}.md`), targetUrl);
      
      results.reportPath = reportsDir;
    }
    
    return results;
  }

  /**
   * Shut down ZAP
   */
  async shutdown(): Promise<void> {
    try {
      await this.zapClient.core.shutdown();
      console.log('🛑 ZAP shutdown initiated');
    } catch (error) {
      console.error('❌ Failed to shutdown ZAP:', error);
    }
  }
}

/**
 * Helper function to create ZAP scanner instance
 */
export function createZapScanner(apiKey: string = 'changeme', proxy: string = 'http://localhost:8080'): ZapScanner {
  return new ZapScanner({ apiKey, proxy });
}

/**
 * Helper function to get ZAP configuration from environment
 */
export function getZapConfigFromEnv(): ZapConfig {
  return {
    apiKey: process.env.ZAP_API_KEY || 'changeme',
    proxy: process.env.ZAP_PROXY || 'http://localhost:8080',
    zapUrl: process.env.ZAP_URL || 'http://localhost:8080',
  };
}
