const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

let server = null;

function startServerAndCreateWindow() {
  const outDir = path.join(__dirname, 'out');

  server = http.createServer((req, res) => {
    try {
      let reqUrl = decodeURIComponent(req.url.split('?')[0]);
      if (reqUrl === '/') reqUrl = '/index.html';

      let filePath = path.join(outDir, reqUrl);

      // If missing extension, check if HTML file exists
      if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }

      // If file does not exist, fallback to index.html (SPA routing)
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(outDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    }
  });

  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;

    const win = new BrowserWindow({
      width: 1366,
      height: 868,
      minWidth: 1024,
      minHeight: 700,
      title: 'Vision Tech - WhatsApp Webhook & Integration Simulator',
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    win.loadURL(`http://127.0.0.1:${port}`);
  });
}

app.whenReady().then(startServerAndCreateWindow);

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    startServerAndCreateWindow();
  }
});
