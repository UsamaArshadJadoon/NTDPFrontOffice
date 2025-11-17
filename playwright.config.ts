import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Run tests sequentially to avoid context issues
  timeout: 90000, // 90 seconds
  expect: {
    timeout: 15000 // 15 seconds for assertions
  },
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ] : [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://portal-uat.ntdp-sa.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000, // Increased for CI
    navigationTimeout: 60000,
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
