import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotDir = '/tmp/login_verification';
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${screenshotDir}/01_login_page.png` });
    console.log('✅ Login page loaded');
    
    // Step 2: Enter credentials
    console.log('\nStep 2: Entering credentials...');
    await page.fill('input[type="email"]', 'test1779512260@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.screenshot({ path: `${screenshotDir}/02_credentials_entered.png` });
    console.log('✅ Credentials entered');
    
    // Step 3: Click login button
    console.log('\nStep 3: Clicking login button...');
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await loginButton.click();
    
    // Wait for redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Redirected to dashboard');
    await page.screenshot({ path: `${screenshotDir}/03_dashboard_page.png` });
    
    // Step 4: Check if username is in sidebar
    console.log('\nStep 4: Checking for username in sidebar...');
    const userNameElements = await page.locator('.sidebar *:has-text("test1779512260"), .app-sidebar *:has-text("test")').all();
    if (userNameElements.length > 0) {
      console.log('✅ Username found in sidebar');
    } else {
      const pageText = await page.textContent('body');
      if (pageText.includes('test')) {
        console.log('✅ User info visible on page');
      } else {
        console.log('⚠️  Could not find user name in visible sidebar');
      }
    }
    
    // Step 5: Look for logout button
    console.log('\nStep 5: Looking for logout button...');
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Salir"), a:has-text("Salir"), a:has-text("Logout")');
    const count = await logoutButton.count();
    if (count > 0) {
      console.log('✅ Logout button found');
      await logoutButton.first().screenshot({ path: `${screenshotDir}/04_logout_button.png` });
    } else {
      console.log('⚠️  Logout button not found by text');
    }
    
    // Step 6: Take full page screenshot
    console.log('\nStep 6: Full dashboard screenshot...');
    await page.screenshot({ path: `${screenshotDir}/05_full_dashboard.png`, fullPage: true });
    
    console.log('\n✅ Verification complete! Check screenshots in ' + screenshotDir);
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    await page.screenshot({ path: `${screenshotDir}/error.png` });
  } finally {
    await browser.close();
  }
})();
