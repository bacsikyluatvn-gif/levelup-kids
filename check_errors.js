const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        page.on('console', msg => console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`));
        page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.toString()}`));
        console.log("Navigating...");
        await page.goto('http://localhost:3000/dashboard-parent/index.html', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));
        console.log("Done");
        await browser.close();
    } catch (e) { console.error("Script exception:", e); }
    process.exit(0);
})();
