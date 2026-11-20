const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const DIST_DIR = path.resolve(__dirname, '../client/dist');
const ASSETS_DIR = path.resolve(__dirname, 'assets');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;

// Copy existing logos and icons to assets
const logoSrc = path.resolve(__dirname, '../client/public/vynora_icon_circle.png');
const logoDest = path.join(ASSETS_DIR, 'vynora_logo.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('✅ Copied logo to assets/vynora_logo.png');
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, reqPath);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`🚀 Static server serving client/dist on http://127.0.0.1:${PORT}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--hide-scrollbars'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    const screens = [
      { name: 'screen_dashboard.png', path: '/', delay: 2000 },
      { name: 'screen_finance.png', path: '/finance', delay: 1800 },
      { name: 'screen_agriculture.png', path: '/agriculture', delay: 1800 },
      { name: 'screen_dairy.png', path: '/dairy', delay: 1800 },
      { name: 'screen_loans.png', path: '/loans', delay: 1800 },
      { name: 'screen_health.png', path: '/health', delay: 1800 },
      { name: 'screen_vault.png', path: '/password-vault', delay: 1800 },
      { name: 'screen_login.png', path: '/login', delay: 1500 }
    ];

    for (const item of screens) {
      const url = `http://127.0.0.1:${PORT}${item.path}`;
      console.log(`📸 Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Allow extra time for charts and animations to complete
      await new Promise(r => setTimeout(r, item.delay));
      
      const outPath = path.join(ASSETS_DIR, item.name);
      await page.screenshot({ path: outPath, type: 'png' });
      const stats = fs.statSync(outPath);
      console.log(`✅ Saved ${item.name} (${Math.round(stats.size / 1024)} KB)`);
    }

    await browser.close();
    console.log('🎉 All 8 application screens captured successfully!');
  } catch (err) {
    console.error('❌ Error capturing screens:', err);
  } finally {
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  }
});
