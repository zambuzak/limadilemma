/**
 * WSS-to-Stratum Proxy for Browser Mining Benchmark
 * 
 * Bridges browser WebSocket connections to MoneroOcean TCP Stratum.
 * Run: node proxy.js
 * Listens on: ws://localhost:8892
 * 
 * Install dependency first: npm install ws
 */

const WebSocket = require('ws');
const net = require('net');

const PROXY_PORT = 8892;
const POOL_HOST = 'gulf.moneroocean.stream';
const POOL_PORT = 10008; // MoneroOcean's low-diff port — best for browser miners

const wss = new WebSocket.Server({ port: PROXY_PORT });

let connectionCount = 0;

console.log(`[proxy] Starting WSS-to-Stratum proxy on ws://localhost:${PROXY_PORT}`);
console.log(`[proxy] Forwarding to ${POOL_HOST}:${POOL_PORT}`);
console.log(`[proxy] Ready. Open a test harness HTML file in your browser.\n`);

wss.on('connection', (ws, req) => {
  const clientId = ++connectionCount;
  const clientIp = req.socket.remoteAddress;
  console.log(`[client ${clientId}] Connected from ${clientIp}`);

  // Open TCP connection to pool
  const tcp = net.createConnection({ host: POOL_HOST, port: POOL_PORT });

  let workerName = 'unknown';
  let buffer = '';

  // Browser → Pool
  ws.on('message', (data) => {
    const msg = data.toString();
    
    // Intercept login message to log worker name
    try {
      const parsed = JSON.parse(msg);
      if (parsed.method === 'login') {
        workerName = parsed.params?.pass || parsed.params?.login || 'unknown';
        console.log(`[client ${clientId}] LOGIN detected — worker/pass: "${workerName}"`);
        console.log(`[client ${clientId}] Full login params: ${JSON.stringify(parsed.params)}`);
      }
      if (parsed.method === 'submit') {
        console.log(`[client ${clientId}] SHARE SUBMITTED ✓`);
      }
    } catch(e) {}

    if (tcp.writable) {
      tcp.write(msg + '\n');
    }
  });

  // Pool → Browser
  tcp.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line

    lines.forEach(line => {
      if (!line.trim()) return;
      try {
        const parsed = JSON.parse(line);
        // Log jobs received from pool
        if (parsed.method === 'job') {
          console.log(`[client ${clientId}] JOB received from pool (diff: ${parsed.params?.target || 'n/a'})`);
        }
        if (parsed.result?.status === 'OK') {
          console.log(`[client ${clientId}] Share accepted by pool ✓`);
        }
      } catch(e) {}

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(line);
      }
    });
  });

  tcp.on('connect', () => {
    console.log(`[client ${clientId}] TCP connection to pool established`);
  });

  tcp.on('error', (err) => {
    console.error(`[client ${clientId}] Pool TCP error: ${err.message}`);
    ws.close();
  });

  tcp.on('close', () => {
    console.log(`[client ${clientId}] Pool connection closed`);
    ws.close();
  });

  ws.on('close', () => {
    console.log(`[client ${clientId}] Browser disconnected (worker: "${workerName}")`);
    tcp.destroy();
  });

  ws.on('error', (err) => {
    console.error(`[client ${clientId}] WebSocket error: ${err.message}`);
    tcp.destroy();
  });
});

wss.on('error', (err) => {
  console.error(`[proxy] Server error: ${err.message}`);
});
