import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigate to login');
    await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'test1779512260@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('\n📋 Dashboard Page Content Analysis:');
    console.log('=====================================');
    console.log('Title:', await page.title());
    console.log('URL:', page.url());

    // Get all text content
    const text = await page.textContent('body');
    console.log('\nText content length:', text.length);
    if (text.includes('Test User')) {
      console.log('✅ "Test User" found in page');
    }

    // Look for all buttons
    const buttons = await page.locator('button').allTextContents();
    console.log('\nButtons found:', buttons.length);
    buttons.forEach(btn => console.log('  -', btn));

    // Look for links
    const links = await page.locator('a').allTextContents();
    console.log('\nLinks found:', links.length);
    links.slice(0, 20).forEach(link => console.log('  -', link));

    // Check for specific logout-related elements
    console.log('\nSearching for logout/profile elements...');
    const logout = await page.locator('*:has-text("Logout")').first();
    console.log('Logout element:', await logout.isVisible().catch(() => false));

    const salir = await page.locator('*:has-text("Salir")').first();
    console.log('Salir element:', await salir.isVisible().catch(() => false));

    // Check sidebar structure
    console.log('\nSidebar analysis:');
    const sidebar = await page.locator('aside, nav, [class*="sidebar" i], [class*="menu" i]').first();
    if (sidebar) {
      const sidebarText = await sidebar.textContent();
      console.log('Sidebar found. Content preview:', sidebarText?.substring(0, 200));
    }

    // Check header/navbar
    console.log('\nHeader analysis:');
    const header = await page.locator('header, nav:first-of-type, [role="banner"]').first();
    if (header) {
      const headerText = await header.textContent();
      console.log('Header found. Content preview:', headerText?.substring(0, 200));
    }

    // Save screenshot
    await page.screenshot({ path: '/tmp/dashboard-screenshot.png' });
    console.log('\n📸 Screenshot saved to /tmp/dashboard-screenshot.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
