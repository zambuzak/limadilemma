const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.wasm': 'application/wasm',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon'
};

const PORT = 3000;
const DIR  = process.argv[2] || '.';

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? '/index.html' : req.url);
  // strip query strings
  filePath = filePath.split('?')[0];

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,


    });
    res.end(data);
    console.log(`[serve] ${req.method} ${req.url} → ${mime}`);
  });
}).listen(PORT, () => {
  console.log(`[serve] Listening on http://localhost:${PORT}`);
  console.log(`[serve] Serving: ${path.resolve(DIR)}`);
  console.log(`[serve] WASM MIME type: application/wasm ✓`);
});
