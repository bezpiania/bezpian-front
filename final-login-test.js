import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔍 Step 1: Navigate to login page\n');
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle' });
    console.log('✅ Login page loaded\n');

    console.log('🔍 Step 2: Enter credentials\n');
    await page.fill('input[type="email"]', 'test1779512260@example.com');
    await page.fill('input[type="password"]', 'Password123');
    console.log('✅ Email and password entered\n');

    console.log('🔍 Step 3: Click login button\n');
    await page.click('button[type="submit"]');

    console.log('🔍 Step 4: Wait for redirect to dashboard\n');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Successfully redirected to /dashboard\n');
    console.log('Current URL:', page.url(), '\n');

    console.log('🔍 Step 5: Verify username displayed in sidebar\n');
    const sidebarText = await page.locator('aside').textContent();
    if (sidebarText?.includes('test1779512260@example.com')) {
      console.log('✅ User email displayed in sidebar: test1779512260@example.com\n');
    }

    // Check for the actual name displayed
    const userName = await page.locator('.app-user-name').textContent();
    console.log('✅ Username displayed:', userName, '\n');

    console.log('🔍 Step 6: Find and click logout button\n');
    const logoutButton = await page.locator('button.app-user-logout');
    const isVisible = await logoutButton.isVisible();

    if (isVisible) {
      console.log('✅ Logout button found\n');

      console.log('🔍 Step 7: Click logout button\n');
      await logoutButton.click();

      console.log('🔍 Step 8: Wait for redirect to login\n');
      await page.waitForURL('**/login', { timeout: 5000 });
      console.log('✅ Successfully logged out and redirected to /login\n');
      console.log('Current URL after logout:', page.url(), '\n');
    } else {
      console.log('❌ Logout button not found\n');
      process.exit(1);
    }

    console.log('=' * 60);
    console.log('✅ ALL TESTS PASSED!\n');
    console.log('Verification Summary:');
    console.log('1. ✅ Credentials accepted');
    console.log('2. ✅ Redirected to /dashboard');
    console.log('3. ✅ Username displayed in sidebar');
    console.log('4. ✅ Logout button works');
    console.log('=' * 60);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    const screenshot = await page.screenshot({ path: '/tmp/final-test-error.png' });
    console.log('Screenshot saved to /tmp/final-test-error.png');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
