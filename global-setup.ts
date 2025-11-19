import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Setting up global test environment...');
  
  // Test network connectivity
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('🔍 Testing network connectivity...');
    await page.goto('https://portal-uat.ntdp-sa.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    console.log('✅ Network connectivity verified');
    
    await browser.close();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('⚠️ Network connectivity issues detected:', errorMessage);
    console.log('🔄 Tests will run with increased resilience...');
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;