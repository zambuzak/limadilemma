// randomx-worker-v3.js — Debug version
import { randomx_create_vm, randomx_init_cache } from '/randomx.web.js';

let vm = null;
let job = null;
let running = false;
let hashCount = 0;
let lastReport = Date.now();
let myThreadId = 0;
let myTotalThreads = 6;
const BATCH = 100;

function hexToBytes(hex) {
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) b[i/2] = parseInt(hex.substr(i,2),16);
  return b;
}

function bytesToHex(b) {
  return Array.from(b).map(x => x.toString(16).padStart(2,'0')).join('');
}

function meetsTarget(hash, target) {
  for (let i = 31; i >= 0; i--) {
    if (hash[i] < target[i]) return true;
    if (hash[i] > target[i]) return false;
  }
  return true;
}

function mineLoop() {
  if (!running || !vm || !job) {
    return;
  }

  const blob = hexToBytes(job.blob);
  const target = hexToBytes(job.target.padEnd(64,'0'));
  let nonce = job.nonce;

  for (let i = 0; i < BATCH; i++) {
    blob[39] = nonce & 0xff;
    blob[40] = (nonce >> 8) & 0xff;
    blob[41] = (nonce >> 16) & 0xff;
    blob[42] = (nonce >> 24) & 0xff;
    const hash = vm.calculate_hash(blob);
    hashCount++;
    nonce = (nonce + 1) >>> 0;
    if (meetsTarget(hash, target)) {
      postMessage({ type:'share', nonce: bytesToHex(new Uint8Array([nonce&0xff,(nonce>>8)&0xff,(nonce>>16)&0xff,(nonce>>24)&0xff])), result: bytesToHex(hash), job_id: job.job_id });
    }
  }

  job.nonce = nonce;

  const now = Date.now();
  if ((now - lastReport) >= 1000) {
    postMessage({ type:'hashrate', hashrate: hashCount / ((now - lastReport) / 1000) });
    hashCount = 0;
    lastReport = now;
  }

  setTimeout(mineLoop, 0);
}

onmessage = ({ data: msg }) => {

  if (msg.type === 'init') {
    myThreadId = msg.threadId || 0;
    myTotalThreads = msg.totalThreads || 6;
    try {
      const cache = randomx_init_cache(hexToBytes(msg.seedHash || '0'.repeat(64)));
      vm = randomx_create_vm(cache);
      postMessage({ type: 'vm_ready' });
    } catch(e) {
      postMessage({ type: 'error', msg: e.message });
    }
  }

  if (msg.type === 'job') {
    const range = Math.floor(0xFFFFFF / myTotalThreads);
    job = { ...msg.job, nonce: myThreadId * range };
    if (!running) {
      running = true;
      mineLoop();
    }
  }

  if (msg.type === 'stop') {
    running = false;
  }
};

postMessage({ type: 'ready' });
