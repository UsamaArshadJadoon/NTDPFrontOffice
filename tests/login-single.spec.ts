import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { validCredentials } from '../testData/credentials';

test.describe('NTDP Portal Login - Single Valid Test', () => {
  test('should successfully login and redirect to dashboard', async ({ page }) => {
    test.setTimeout(60000);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Navigate to login page
    await loginPage.goto();
    await expect(page).toHaveURL(/.*login.*/);

    // Step 2: Enter valid Saudi ID from environment
    await loginPage.enterSaudiId(validCredentials.saudiId);
    
    // Step 3: Verify login button is enabled
    await expect(loginPage.loginButton).toBeEnabled();

    // Step 4: Click login button
    await loginPage.clickLogin();

    // Step 5: Wait for login response (extended wait for processing)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(25000);

    // Step 6: Check for login errors first with detailed debugging
    console.log('=== CHECKING FOR ERRORS ===');
    const errorMessage = await loginPage.hasLoginError();
    
    // Additional error checking
    const hasLoginFailedText = await page.getByText('Login failed').isVisible().catch(() => false);
    const hasErrorText = await page.getByText('Error').isVisible().catch(() => false);
    const hasInvalidText = await page.getByText('Invalid').isVisible().catch(() => false);
    
    console.log('Error message from hasLoginError():', errorMessage);
    console.log('Has "Login failed" text:', hasLoginFailedText);
    console.log('Has "Error" text:', hasErrorText);
    console.log('Has "Invalid" text:', hasInvalidText);
    console.log('Saudi ID used:', validCredentials.saudiId);
    
    if (errorMessage || hasLoginFailedText) {
      await page.screenshot({ path: 'login-error-debug.png', fullPage: true });
      throw new Error(`Login failed: ${errorMessage || 'Login failed text detected'}`);
    }

    // Step 7: Verify successful login indicators with detailed debugging
    const currentUrl = page.url();
    const loginFormHidden = await loginPage.saudiIdInput.isHidden().catch(() => false);
    const loginFormVisible = await loginPage.saudiIdInput.isVisible().catch(() => true);
    const welcomeVisible = await page.getByText(/Welcome/i).isVisible().catch(() => false);
    const urlChanged = !currentUrl.endsWith('/login');
    const urlContainsHome = currentUrl.includes('/home');
    
    console.log('=== LOGIN SUCCESS INDICATORS ===');
    console.log('Current URL:', currentUrl);
    console.log('Login form hidden:', loginFormHidden);
    console.log('Login form visible:', loginFormVisible);
    console.log('Welcome message visible:', welcomeVisible);
    console.log('URL changed from /login:', urlChanged);
    console.log('URL contains /home:', urlContainsHome);
    
    // Check for additional success indicators
    const hasVerificationCode = await page.getByText('Verification code').isVisible().catch(() => false);
    const hasNafathRequest = await page.getByText('Nafath').isVisible().catch(() => false);
    
    console.log('Has verification code:', hasVerificationCode);
    console.log('Has Nafath request:', hasNafathRequest);

    // Step 8: Assert successful login (multiple success conditions)
    const loginSuccessful = loginFormHidden || !loginFormVisible || urlChanged || urlContainsHome || hasVerificationCode || hasNafathRequest;
    
    console.log('=== FINAL RESULT ===');
    console.log('Login successful:', loginSuccessful);
    
    if (!loginSuccessful) {
      // Take screenshot for debugging
      await page.screenshot({ path: 'login-failure-debug.png', fullPage: true });
      console.log('Screenshot saved as login-failure-debug.png');
    }
    
    expect(loginSuccessful).toBe(true);

    // Step 9: If redirected to dashboard, verify dashboard elements
    if (urlChanged && !page.url().includes('login')) {
      console.log('Redirected to dashboard - verifying dashboard elements');
      
      // Wait for dashboard to load
      await dashboardPage.waitForPageLoad();
      
      // Verify we're not on login page anymore
      await expect(page).not.toHaveURL(/.*login.*/);
      
      // Verify dashboard/welcome content
      await dashboardPage.verifyWelcomeMessage();
      
      console.log('Dashboard verification successful');
    } else {
      console.log('No redirect detected - checking for in-page success indicators');
      
      // If no redirect, verify welcome message appears on same page
      await expect(page.getByText(/Welcome/i)).toBeVisible();
      
      // Optionally verify login form is hidden or disabled
      if (loginFormHidden) {
        await expect(loginPage.saudiIdInput).not.toBeVisible();
      }
    }

    // Step 10: Take screenshot for verification
    await page.screenshot({ path: 'login-success-verification.png', fullPage: true });
    
    console.log('Login test completed successfully');
  });
});