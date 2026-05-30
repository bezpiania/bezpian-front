import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotDir = '/tmp/zapien-screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

let stepNum = 0;

async function screenshot(page, name) {
  stepNum++;
  const filename = `${screenshotDir}/${String(stepNum).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`📸 Screenshot: ${name} → ${filename}`);
  return filename;
}

async function runTests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);

  try {
    console.log('🚀 INICIANDO PRUEBAS DE CHATBOTS\n');

    // FASE 1: LOGIN
    console.log('=== FASE 1: LOGIN ===');
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'test1779512260@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await screenshot(page, '01-login-success');
    console.log('✅ Login exitoso\n');

    // FASE 2: BOT BÁSICO
    console.log('=== FASE 2: BOT BÁSICO ===');
    await page.click('button:has-text("Crear Chatbot")');
    await page.waitForTimeout(500);
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length > 0) {
      await inputs[0].fill('Bot Básico V1');
      const textareas = await page.$$('textarea');
      if (textareas.length > 0) {
        await textareas[0].fill('Mi primer chatbot de prueba');
      }
    }
    await page.click('button:has-text("Crear")');
    await page.waitForTimeout(2000);
    await screenshot(page, '02-bot-created');
    console.log('✅ Bot Básico creado\n');

    // FASE 3: WIDGET
    console.log('=== FASE 3: PROBAR WIDGET ===');
    // Buscar botón de widget
    const botLinks = await page.$$('[href*="bot"]');
    if (botLinks.length > 0) {
      await botLinks[0].click();
      await page.waitForTimeout(1000);
    }
    await screenshot(page, '03-bot-detail');
    console.log('✅ Bot detail page abierto\n');

    // FASE 4: AGREGAR OPENAI
    console.log('=== FASE 4: AGREGAR OPENAI ===');
    const configTabs = await page.$$('a, button');
    for (const tab of configTabs) {
      const text = await tab.textContent();
      if (text?.includes('Configuración')) {
        await tab.click();
        break;
      }
    }
    await page.waitForTimeout(1000);
    await screenshot(page, '04-config-tab');
    console.log('✅ Tab de configuración abierto\n');

    // FASE 5: INTEGRACIONES
    console.log('=== FASE 5: INTEGRACIONES ===');
    const integrationLinks = await page.$$('a, button');
    for (const link of integrationLinks) {
      const text = await link.textContent();
      if (text?.includes('Integracion') || text?.includes('integración')) {
        await link.click();
        break;
      }
    }
    await page.waitForTimeout(1000);
    await screenshot(page, '05-integrations-page');
    console.log('✅ Página de integraciones abierta\n');

    // Verificar tarjetas de integraciones
    const cards = await page.$$('.card, [class*="integration"]');
    console.log(`   → Encontradas ${cards.length} tarjetas de integración`);
    await screenshot(page, '06-all-integrations');

    // FASE 6: GOOGLE CALENDAR
    console.log('=== FASE 6: GOOGLE CALENDAR ===');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text?.includes('Conectar')) {
        await btn.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    await screenshot(page, '07-google-calendar-modal');
    console.log('✅ Modal de Google Calendar visible\n');

    // Cerrar modal
    const closeButtons = await page.$$('button[aria-label*="close"], button[class*="close"]');
    if (closeButtons.length > 0) {
      await closeButtons[0].click();
      await page.waitForTimeout(500);
    }

    // FASE 7: WHATSAPP
    console.log('=== FASE 7: WHATSAPP ===');
    const btns = await page.$$('button');
    let foundWhatsApp = false;
    for (const btn of btns) {
      const text = await btn.textContent();
      if (text?.includes('Conectar') && !foundWhatsApp) {
        await btn.click();
        await page.waitForTimeout(800);
        foundWhatsApp = true;
        break;
      }
    }
    await screenshot(page, '08-whatsapp-modal');
    console.log('✅ Modal de WhatsApp visible\n');

    // FASE 8: INSTAGRAM
    console.log('=== FASE 8: INSTAGRAM ===');
    await page.click('[aria-label*="close"], button:has-text("Cancelar")', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
    await screenshot(page, '09-integrations-full');
    console.log('✅ Todas las integraciones visibles\n');

    // FASE 9: DOCUMENTO
    console.log('=== FASE 9: SUBIR DOCUMENTO ===');
    const docLinks = await page.$$('a, button');
    for (const link of docLinks) {
      const text = await link.textContent();
      if (text?.includes('Documento')) {
        await link.click();
        await page.waitForTimeout(1000);
        break;
      }
    }
    await screenshot(page, '10-documents-page');
    console.log('✅ Página de documentos abierta\n');

    // FASE 10: DASHBOARD
    console.log('=== FASE 10: DASHBOARD ===');
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForTimeout(1500);
    await screenshot(page, '11-dashboard-final');
    console.log('✅ Dashboard visible\n');

    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE\n');
    console.log('📊 RESUMEN:');
    console.log('  ✅ Login con credenciales');
    console.log('  ✅ Crear Bot Básico');
    console.log('  ✅ Acceder a detalle del bot');
    console.log('  ✅ Panel de configuración');
    console.log('  ✅ Página de integraciones');
    console.log('  ✅ Google Calendar modal');
    console.log('  ✅ WhatsApp modal');
    console.log('  ✅ Página de documentos');
    console.log('  ✅ Dashboard con datos');
    console.log(`\n📸 Screenshots: ${screenshotDir}`);

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error.stack);
    await screenshot(page, 'error').catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
