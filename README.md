# Browser Crypto Mining Research

> Consent-first web mining as a monetization layer — empirical benchmarks, revenue models, and implementation baseline.

**Research period:** May 2026 · **Agents:** Claude · Gemini · Grok · ChatGPT  
**Dashboard:** [View live →](./dashboard/index.html)

---

## TL;DR

| Metric | Value |
|---|---|
| Best script (current) | `l1mey112/randomx.js` |
| Peak H/s (6 threads, Chrome) | 38.64 H/s |
| Revenue per 1,000 visitors / 5 min session | ~$1.08/day |
| Revenue lever with highest ROI | Session duration (linear multiplier) |
| Pending test that may change winner | Crypto-Webminer Flex/zpool |
| Upcoming improvement | randomx.js v2 (softfloat fix, ~2-4x gain) |

---

## Revenue Formula

```
revenue = session_seconds × H/s_per_visitor × visitors
        ÷ network_H/s × daily_XMR_issued × XMR_price
```

At 31 H/s avg, 1,000 visitors, 5 min sessions, $385 XMR:
- **$1.08/day · $32/month**

---

## Repo Structure

```
limadilemma/
│
├── README.md
├── dashboard/
│   └── index.html              ← Interactive research dashboard
│
├── benchmark/
│   ├── randomx-server.js       ← Node.js Stratum server (pool bridge + HTTP)
│   ├── randomx-worker-v3-clean.js  ← Optimized Web Worker (6 threads)
│   ├── server-v2.js            ← Local HTTP server with COOP/COEP headers
│   ├── proxy.js                ← WSS-to-Stratum proxy (for opd-ai/webminer)
│   ├── test-randomx-max-FINAL.html  ← randomx.js 6-thread benchmark
│   ├── test-opd-webminer-FINAL.html ← opd-ai/webminer benchmark
│   └── results-comparison.html ← Results collector
│
├── pending/
│   └── test-crypto-flex.html   ← Crypto-Webminer Flex/zpool (blocked — CDN SSL)
│
└── research/
    ├── chatgpt_webminer_merge_output_v2.md   ← 10-task merge validation
    └── crypto_mining_research_FINAL.md       ← Coin research final report
```

---

## Scripts Evaluated

| Script | Algorithm | Peak H/s | WASM | Status |
|---|---|---|---|---|
| **l1mey112/randomx.js** ⭐ | RandomX | **38.64** | ✅ JIT | Benchmarked |
| opd-ai/webminer | RandomX | 18.53 | ❌ JS fallback | Benchmarked |
| PiTi2k5/Crypto-Webminer | GhostRider/Flex | — | ⚠️ | CDN blocked |
| MarcoCiaramella/cpu-web-miner | GhostRider | 0 | ❌ | WASM silent fail |

---

## Running the Benchmark

### Requirements
- Node.js v18+
- `npm install ws randomx.js`

### randomx.js benchmark (recommended)
```bash
# Terminal 1 — start server (connects to MoneroOcean, serves files)
node benchmark/randomx-server.js

# Open Chrome
open http://localhost:8080/benchmark/test-randomx-max-FINAL.html
```

### opd-ai/webminer benchmark
```bash
# Terminal 1 — local server with COOP/COEP headers
node benchmark/server-v2.js .

# Terminal 2 — WSS-to-Stratum proxy
node benchmark/proxy.js

# Open Chrome
open http://localhost:3000/benchmark/test-opd-webminer-FINAL.html
```

---

## Key Findings

### 1. RandomX has a fundamental browser ceiling
RandomX fast mode requires 2GB RAM — browsers cap WASM memory far below this. All browser implementations run in light mode (~256MB). This is a **structural constraint**, not a software bug.

| Implementation | H/s (6-core) | Mode |
|---|---|---|
| Native XMRig | ~4,000 H/s | Fast mode + AES-NI |
| randomx.js (current) | ~38 H/s | Light mode, JIT WASM |
| opd-ai/webminer | ~18 H/s | Light mode, JS fallback |
| Browser ceiling (estimated) | ~100 H/s | With all optimizations |

### 2. Startup latency matters more than peak hashrate
opd-ai/webminer's 33-second startup means a visitor with a 2-minute session wastes 27% of their time initializing. randomx.js starts in 1.5 seconds.

### 3. Session duration is the highest-leverage variable
Doubling session duration doubles revenue exactly. This makes consent UX design more valuable than hashrate optimization past ~80 H/s.

### 4. randomx.js v2 may change everything
Developer l-m confirmed on Discord (May 19, 2026): v1 was archived just before completing softfloat (directed FP rounding) support. v2 with softfloat working = expected 2-4x hashrate improvement.

### 5. Crypto-Webminer Flex/zpool is untested but promising
Developer PiTi claims 30-50% higher profitability via GhostRider auto-algo switching on zpool. GhostRider runs efficiently in WASM (no 2GB memory constraint). Blocked by CDN SSL cert issues.

---

## Developer Outreach

| Developer | Script | Status | Key Response |
|---|---|---|---|
| l-m | randomx.js | ✅ Responded | v2 with softfloat in development |
| PiTi2k5 | Crypto-Webminer | ✅ Responded | Flex/zpool recommended · CDN certs broken |
| opd-ai | webminer | ⏳ Pending | GitHub issue opened — WASM + workerName questions |

---

## Pending Tests

- [ ] **Crypto-Webminer Flex/zpool** — awaiting CDN fix or self-hosted file from developer
- [ ] **randomx.js v2** — awaiting public release
- [ ] **opd-ai/webminer workerName patch** — can patch ourselves, pending decision
- [ ] **randomx.js-shared** — SAB cache sharing, needs source build from archived repo

---

## Coins Shortlist

**Tier 1 (production-ready):** XMR · RVN · CFX · FIRO · ERG · IRON · CLORE · ZANO  
**Primary target:** XMR (Monero) — highest liquidity, ASIC-resistant, best browser CPU fit  
**Alternative path:** RTM → XMR via MoneroOcean auto-switch (GhostRider, higher browser WASM efficiency)

---

*All revenue figures are gross estimates pre-electricity, fees, slippage, and taxes. Recalculate at time of deployment using current network hashrate, XMR price, and block reward.*
