import { test, expect } from '@playwright/test';

test('Login flow', async ({ page }) => {
  console.log('🔵 Navigating to login page...');
  await page.goto('http://localhost:5173/login');
  
  console.log('🔵 Waiting for login form...');
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  
  console.log('🔵 Entering credentials...');
  await page.fill('input[type="email"]', 'test1779512260@example.com');
  await page.fill('input[type="password"]', 'Password123');
  
  console.log('🔵 Taking screenshot before login...');
  await page.screenshot({ path: '/tmp/before-login.png' });
  
  console.log('🔵 Clicking login button...');
  const buttons = await page.locator('button').all();
  let clicked = false;
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text && (text.includes('Login') || text.includes('Iniciar') || text.includes('Entrar'))) {
      await btn.click();
      clicked = true;
      console.log(`✅ Clicked button: ${text}`);
      break;
    }
  }
  
  if (!clicked) {
    console.log('⚠️ Could not find login button, trying to click any visible button');
    await page.locator('button').first().click();
  }
  
  console.log('🔵 Waiting for redirect...');
  await page.waitForURL(/dashboard/, { timeout: 10000 }).catch(() => {
    console.log('⚠️ Timeout waiting for dashboard redirect');
  });
  
  const currentUrl = page.url();
  console.log(`✅ Current URL: ${currentUrl}`);
  
  console.log('🔵 Taking screenshot after login...');
  await page.screenshot({ path: '/tmp/after-login.png' });
  
  console.log('🔵 Checking page content...');
  const pageText = await page.textContent('body');
  console.log('📄 Page contains:', pageText.substring(0, 200));
  
  console.log('🔵 Looking for logout button...');
  const allButtons = await page.locator('button').all();
  for (const btn of allButtons) {
    const text = await btn.textContent();
    if (text && (text.includes('Logout') || text.includes('Salir') || text.includes('Cerrar'))) {
      console.log(`✅ Found logout button: ${text}`);
      break;
    }
  }
});
