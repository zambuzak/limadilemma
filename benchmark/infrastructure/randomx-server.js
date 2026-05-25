/**
 * randomx.js Mining Server
 * 
 * Architecture:
 *   Browser → WebSocket (port 8080) → This server → TCP Stratum → MoneroOcean pool
 * 
 * This server:
 * 1. Connects to MoneroOcean via TCP Stratum
 * 2. Gets mining jobs from the pool
 * 3. Serves a browser page that uses randomx.js to hash
 * 4. Browser sends found nonces back here
 * 5. We submit valid shares to the pool
 * 
 * Run: node randomx-server.js
 */

const http = require('http');
const net  = require('net');
const fs   = require('fs');
const path = require('path');
const WebSocket = require('ws');

// ── Config ──────────────────────────────────────────────────────────────────
const WALLET      = '43jJHTVCZBVHHQ4VG5hj8L6XTUxGbLHp8J6WKQw9Un27TFbQzKTEM1UfMNZMqYA2RBbUVV252E4EtJJYoH3US6Wt3zSjFKG';
const WORKER      = 'bench_session_001';
const POOL_HOST   = 'gulf.moneroocean.stream';
const POOL_PORT   = 10008;
const HTTP_PORT   = 8080;
const WS_PORT     = 8081;

// ── State ────────────────────────────────────────────────────────────────────
let currentJob    = null;
let poolSocket    = null;
let poolBuffer    = '';
let poolConnected = false;
let clients       = new Set();
let totalHashes   = 0;
let acceptedShares = 0;
let startTime     = Date.now();

// ── Pool Connection ──────────────────────────────────────────────────────────
function connectPool() {
  console.log(`[pool] Connecting to ${POOL_HOST}:${POOL_PORT}...`);
  poolSocket = net.createConnection({ host: POOL_HOST, port: POOL_PORT });

  poolSocket.on('connect', () => {
    poolConnected = true;
    console.log(`[pool] Connected ✓`);
    // Send login
    const login = {
      id: 1,
      method: 'login',
      params: {
        login: WALLET + '.' + WORKER,
        pass: 'x',
        agent: 'randomx.js-benchmark/1.0'
      }
    };
    poolSocket.write(JSON.stringify(login) + '\n');
    console.log(`[pool] Login sent — worker: ${WORKER}`);
  });

  poolSocket.on('data', (data) => {
    poolBuffer += data.toString();
    const lines = poolBuffer.split('\n');
    poolBuffer = lines.pop();
    
    lines.forEach(line => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        handlePoolMessage(msg);
      } catch(e) {
        console.error('[pool] Parse error:', e.message);
      }
    });
  });

  poolSocket.on('error', (err) => {
    console.error('[pool] Error:', err.message);
    poolConnected = false;
    setTimeout(connectPool, 5000);
  });

  poolSocket.on('close', () => {
    console.log('[pool] Connection closed — reconnecting in 5s...');
    poolConnected = false;
    setTimeout(connectPool, 5000);
  });
}

function handlePoolMessage(msg) {
  // Login response — contains first job
  if (msg.id === 1 && msg.result) {
    console.log(`[pool] Login accepted ✓ — miner_id: ${msg.result.id}`);
    if (msg.result.job) {
      setJob(msg.result.job);
    }
  }
  
  // New job pushed
  if (msg.method === 'job' && msg.params) {
    setJob(msg.params);
  }

  // Share accepted
  if (msg.result && msg.result.status === 'OK') {
    acceptedShares++;
    console.log(`[pool] Share accepted ✓ (total: ${acceptedShares})`);
    broadcastToClients({ type: 'share_accepted', total: acceptedShares });
  }

  // Share rejected
  if (msg.error) {
    console.error(`[pool] Error:`, JSON.stringify(msg.error));
  }
}

function setJob(job) {
  currentJob = job;
  console.log(`[pool] New job — blob: ${job.blob?.substr(0,16)}... diff: ${job.target}`);
  broadcastToClients({ type: 'job', job: currentJob });
}

function submitShare(nonce, result, jobId) {
  if (!poolConnected || !poolSocket) return;
  const submit = {
    id: 2,
    method: 'submit',
    params: {
      id: currentJob?.id || '',
      job_id: jobId,
      nonce: nonce,
      result: result
    }
  };
  poolSocket.write(JSON.stringify(submit) + '\n');
  console.log(`[pool] Share submitted — nonce: ${nonce}`);
}

// ── WebSocket Server (browser ↔ server) ─────────────────────────────────────
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('listening', () => {
  console.log(`[ws] WebSocket server on ws://localhost:${WS_PORT}`);
});

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[ws] Browser connected (total: ${clients.size})`);

  // Send current job immediately
  if (currentJob) {
    ws.send(JSON.stringify({ type: 'job', job: currentJob }));
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      if (msg.type === 'hashrate') {
        totalHashes += msg.count || 0;
        console.log(`[browser] Hashrate: ${msg.hashrate?.toFixed(2)} H/s | Total hashes: ${totalHashes}`);
      }
      
      if (msg.type === 'share') {
        console.log(`[browser] Share found! nonce: ${msg.nonce}`);
        submitShare(msg.nonce, msg.result, msg.job_id);
      }

      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch(e) {
      console.error('[ws] Message parse error:', e.message);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[ws] Browser disconnected (total: ${clients.size})`);
  });
});

function broadcastToClients(msg) {
  const data = JSON.stringify(msg);
  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

// ── HTTP Server (serve the browser page + randomx.js library) ───────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.wasm': 'application/wasm',
  '.map':  'application/json',
};

const httpServer = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  // Serve randomx.js web bundle
  if (urlPath === '/randomx.web.js') {
    const libPath = path.join(__dirname, 'node_modules', 'randomx.js', 'dist', 'web', 'index.js');
    try {
      const content = fs.readFileSync(libPath);
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      });
      res.end(content);
      return;
    } catch(e) {
      res.writeHead(404);
      res.end('randomx.js not found — run: npm install randomx.js');
      return;
    }
  }

  // Serve local files
  const filePath = path.join(__dirname, urlPath.substr(1));
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'text/plain',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    });
    res.end(content);
  } catch(e) {
    res.writeHead(404);
    res.end('Not found: ' + urlPath);
  }
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`\n[http] Server on http://localhost:${HTTP_PORT}`);
  console.log(`[http] Open: http://localhost:${HTTP_PORT}/test-randomx.html`);
  console.log(`[http] COOP/COEP headers set — SharedArrayBuffer enabled ✓\n`);
});

// ── Start ────────────────────────────────────────────────────────────────────
connectPool();

// Stats every 30s
setInterval(() => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  console.log(`[stats] Uptime: ${uptime}s | Clients: ${clients.size} | Accepted shares: ${acceptedShares}`);
}, 30000);
