const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require('@playwright/test');
const {app} = require('../backend/server');

(async () => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors = [];
    const missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(origin) && response.status() >= 400) missing.push(response.url());
    });
    await page.goto(origin, {waitUntil:'networkidle'});
    await page.getByRole('heading',{name:'Where little minds learn & grow'}).waitFor();
    await page.locator('[data-scene-ready="true"]').waitFor({timeout:30000});
    assert.equal(await page.locator('header a[href="/admission"]').first().count(),1);
    assert.equal(await page.locator('header a[href="/login"]').count(),1);
    assert.equal(await page.locator('footer a[href="mailto:nsis.pk@gmail.com"]').count(),1);
    assert.equal(await page.locator('a[aria-label="Chat with us on WhatsApp"]').getAttribute('href'),'https://wa.me/923332207577');
    const screenshots = path.join(process.cwd(),'.git','homepage-preview');
    fs.mkdirSync(screenshots,{recursive:true});
    await page.screenshot({path:path.join(screenshots,'desktop.png')});
    // Scroll the gallery into view so lazy images and reveal animations are exercised.
    await page.getByRole('heading',{name:'Moments that make us proud'}).scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('img')].every(img => !img.complete || img.naturalWidth > 0));
    assert.deepEqual(await page.locator('img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src)),[]);
    await page.setViewportSize({width:390,height:844});
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.locator('[data-scene-ready="true"]').waitFor();
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('button',{name:'Close menu'}).waitFor();
    await page.getByRole('button',{name:'Close menu'}).click();
    await page.screenshot({path:path.join(screenshots,'mobile.png')});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true);
    assert.deepEqual(errors,[]);
    assert.deepEqual(missing,[]);
    for (const route of ['/website','/admission','/login']) {
      const response = await page.request.get(origin+route);
      assert.equal(response.status(),200,route);
    }
    console.log('Homepage verified: desktop/mobile, 3D scene, local photos, menu and portal links.');
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {console.error(error);process.exitCode=1;});
