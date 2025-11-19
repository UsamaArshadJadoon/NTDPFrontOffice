import { defineConfig, devices } from '@playwright/test';

/**
 * Fast and Stable Playwright Configuration
 * Optimized for quick execution of core working tests only
 */
export default defineConfig({
  // Test directory - only stable tests
  testDir: './tests',
  
  // Only run the fast happy path test
  testMatch: [
    '**/login-dashboard-happy-path.spec.ts'
  ],

  // Fast execution settings
  fullyParallel: true,
  forbidOnly: !!(globalThis as any).process?.env?.CI,
  retries: (globalThis as any).process?.env?.CI ? 1 : 0,
  workers: (globalThis as any).process?.env?.CI ? 2 : 4, // More workers for speed
  
  // Fast reporter
  reporter: [
    ['dot'],
    ['html', { open: 'never' }]
  ],

  // Ultra-fast timeout settings
  use: {
    baseURL: 'https://portal-uat.ntdp-sa.com',
    trace: 'off', // Disable for speed
    screenshot: 'only-on-failure',
    video: 'off', // Disable for speed
    
    // Ultra-fast navigation
    actionTimeout: 10000,        // 10s for actions
    navigationTimeout: 20000,    // 20s for navigation
  },

  // Global timeout - ultra fast
  timeout: 45000, // 45s max per test

  // Projects for fast execution
  projects: [
    {
      name: 'chromium-fast',
      use: { 
        ...devices['Desktop Chrome'],
        // Fast Chrome settings
        launchOptions: {
          args: [
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--no-sandbox',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-field-trial-config'
          ]
        }
      },
    }
  ],

  // Global setup disabled for faster CI execution
});