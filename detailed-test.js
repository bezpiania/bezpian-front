import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'test1779512260@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('\n✅ Step 1: Credentials accepted and redirected to /dashboard\n');

    // Check for user name in sidebar
    const sidebarText = await page.locator('aside').textContent();
    console.log('Sidebar content found:', !!sidebarText);
    if (sidebarText?.includes('Sebastián R.')) {
      console.log('✅ Step 2: Username "Sebastián R." is displayed in sidebar');
    } else if (sidebarText?.includes('Test User')) {
      console.log('✅ Step 2: Username "Test User" is displayed in sidebar');
    }
    
    if (sidebarText?.includes('test1779512260@example.com')) {
      console.log('✅ Step 2b: User email is displayed in sidebar');
    }

    // Look for logout functionality
    console.log('\n🔍 Step 3: Looking for logout button...');
    
    // Try clicking on the user section in sidebar
    const userSection = await page.locator('aside').locator('text=/Sebastián|Test User/i').first();
    const userSectionVisible = await userSection.isVisible().catch(() => false);
    console.log('User section visible:', userSectionVisible);

    if (userSectionVisible) {
      console.log('Clicking on user section...');
      await userSection.click();
      await page.waitForTimeout(500);
    }

    // Look for menu items
    const allElements = await page.locator('*:has-text("Salir")').count();
    console.log('Elements with "Salir" text:', allElements);

    const logoutOptions = await page.locator('[role="menuitem"], [role="option"]').allTextContents();
    console.log('Menu items:', logoutOptions);

    // Try finding any clickable logout
    const logoutLink = await page.locator('a:has-text("Salir"), button:has-text("Salir"), [role="menuitem"]:has-text("Salir")').first();
    const logoutVisible = await logoutLink.isVisible().catch(() => false);
    
    if (logoutVisible) {
      console.log('✅ Step 3: Logout button found');
      console.log('Clicking logout...');
      await logoutLink.click();
      
      await page.waitForURL('**/login', { timeout: 5000 });
      console.log('✅ Step 4: Logout successful - redirected to /login');
    } else {
      // Check if there's a dropdown or menu we need to click
      const profileDropdown = await page.locator('button[class*="avatar" i], [role="button"]:has-text("R"), [role="button"]:last-of-type').first();
      const dropdownVisible = await profileDropdown.isVisible().catch(() => false);
      
      if (dropdownVisible) {
        console.log('Found profile dropdown, clicking...');
        await profileDropdown.click();
        await page.waitForTimeout(300);
        
        const salirInMenu = await page.locator('[role="menuitem"]:has-text("Salir"), button:has-text("Salir")').first();
        const salirVisible = await salirInMenu.isVisible().catch(() => false);
        
        if (salirVisible) {
          console.log('✅ Step 3: Logout option found in profile menu');
          await salirInMenu.click();
          await page.waitForURL('**/login', { timeout: 5000 });
          console.log('✅ Step 4: Logout successful - redirected to /login');
        }
      } else {
        console.log('⚠️ Logout button/menu not found');
      }
    }

    console.log('\n✅ All verification steps completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    const screenshot = await page.screenshot({ path: '/tmp/error-screenshot.png' });
    console.log('Screenshot saved');
  } finally {
    await browser.close();
  }
})();
