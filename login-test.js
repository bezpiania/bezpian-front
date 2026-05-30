import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔍 Step 1: Navigate to login page');
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle' });
    console.log('✅ Login page loaded');

    console.log('\n🔍 Step 2: Enter email');
    await page.fill('input[type="email"]', 'test1779512260@example.com');

    console.log('🔍 Step 3: Enter password');
    await page.fill('input[type="password"]', 'Password123');
    console.log('✅ Credentials entered');

    console.log('\n🔍 Step 4: Click login button');
    await page.click('button[type="submit"]');

    console.log('\n🔍 Step 5: Wait for redirect to dashboard');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Successfully redirected to /dashboard');
    console.log('Current URL:', page.url());

    console.log('\n🔍 Step 6: Check if username is displayed in sidebar');
    const userNameElement = await page.locator('text=Test User').first();
    if (await userNameElement.isVisible()) {
      console.log('✅ Username "Test User" is displayed in sidebar');
    } else {
      console.log('⚠️ Username not clearly visible, checking for user info...');
      const allText = await page.content();
      if (allText.includes('Test User')) {
        console.log('✅ Username "Test User" found in page content');
      } else {
        console.log('❌ Username not found');
      }
    }

    console.log('\n🔍 Step 7: Look for logout button');
    const logoutButton = await page.locator('button:has-text("Logout")').first();
    const isVisible = await logoutButton.isVisible().catch(() => false);

    if (isVisible) {
      console.log('✅ Logout button found and visible');

      console.log('\n🔍 Step 8: Click logout button');
      await logoutButton.click();

      console.log('\n🔍 Step 9: Verify redirect to login after logout');
      await page.waitForURL('**/login', { timeout: 5000 });
      console.log('✅ Successfully redirected to /login after logout');
    } else {
      console.log('⚠️ Logout button not found - checking for profile menu');
      const profileDropdown = await page.locator('[role="button"]:has-text("Test User")').first();
      const profileVisible = await profileDropdown.isVisible().catch(() => false);

      if (profileVisible) {
        await profileDropdown.click();
        await page.waitForTimeout(500);
        const logout = await page.locator('text=/logout|salir/i').first();
        const logoutVisible = await logout.isVisible().catch(() => false);
        if (logoutVisible) {
          console.log('✅ Logout option found in profile menu');
          await logout.click();
          await page.waitForURL('**/login', { timeout: 5000 });
          console.log('✅ Successfully logged out');
        } else {
          console.log('⚠️ Logout not found in profile menu, checking page structure...');
          const pageContent = await page.content();
          console.log('Page title:', await page.title());
          console.log('Current URL:', page.url());
        }
      } else {
        console.log('⚠️ Profile menu not found');
      }
    }

    console.log('\n✅ Login flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nCurrent URL:', page.url());
    console.log('Page title:', await page.title());
    const screenshot = await page.screenshot({ path: '/tmp/test-error.png' });
    console.log('Screenshot saved to /tmp/test-error.png');
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
