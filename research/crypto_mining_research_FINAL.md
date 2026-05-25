# PC-Mineable Cryptocurrency Research — Final Validated Master Report
**Date:** 2026-05-14  
**Sources:** Claude (primary research) + Gemini (independent research) + ChatGPT (merge, conflict resolution, additions)  
**Version:** Final — all corrections applied per ChatGPT Section 7 directives

---

## Methodology & Baseline Assumptions

### Hardware Baseline (normalized across all estimates)
| Hardware | Spec | Notes |
|---|---|---|
| CPU | AMD Ryzen 5 5600 (~7 kH/s RandomX) | "Average consumer PC" — more realistic than Gemini's Ryzen 9 5900X baseline |
| GPU | NVIDIA RTX 3060 12GB | Conservative consumer card — GPU-specific hashrates vary per algorithm |

### Revenue Metric Definition
- **All revenue figures = gross USD/day per 1,000 miners**
- **BEFORE:** electricity, pool fees (0–1.5%), exchange fees, slippage, downtime, failed/stale shares, taxes
- For real deployment: rerun via [WhatToMine](https://whattomine.com), [minerstat](https://minerstat.com), or relevant pool calculators at time of action

### Corrections Applied (from ChatGPT conflict resolution)
| # | Correction |
|---|---|
| 1 | **XMR/Binance**: Binance delisted XMR Feb 2024 — Gemini listing was wrong |
| 2 | **ALPH**: Downgraded to Edge/Excluded — ASIC dominance confirmed |
| 3 | **VTC algorithm**: Verthash (not Lyra2REv3) — Gemini was stale |
| 4 | **FLUX**: Excluded — ZelHash PoW mining ended Oct 25, 2025 (Flux v9.0.0) |
| 5 | **BEAM**: Name collision flagged — mineable Mimblewimble BEAM ≠ gaming BEAM token |
| 6 | **ETC**: Kept as Edge — technically GPU-mineable but ASIC-heavy |
| 7 | **Revenue normalization**: All estimates re-baselined to Ryzen 5 5600 / RTX 3060 |
| 8 | **Gemini ERG hashrate**: Claimed 1.13–1.40 EH/s likely a unit error (probably TH/s) |

---

## Tier 1 — Core PC-Mineable Candidates
> Strong evidence for PC mining viability + meaningful exchange liquidity

| # | Coin | Algorithm / Type | Normalized 24h Vol | Key Exchanges | Gross Rev/day per 1K avg PCs | Active Mining Pools | Mining Software (last 12mo) | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | **Monero (XMR)** | RandomX / CPU | $130M–$150M | KuCoin, MEXC, Gate.io, Kraken (select regions), Haveno DEX ⚠️ *Binance delisted Feb 2024* | **$210–$240/day** (CPU) | P2Pool (0%, decentralized), SupportXMR (0.6%), MoneroOcean (0%), Nanopool (1%), C3Pool (0%) | XMRig v6.26.0 (Mar 2026), P2Pool (active 2026), SRBMiner-Multi | **HIGH** |
| 2 | **Ravencoin (RVN)** | KawPow / GPU | $5M–$8M | Binance, OKX, Bybit, KuCoin, Gate.io, HTX (~40 exchanges) | **$45–$70/day** (GPU) | 2Miners (1%), Flypool (1–1.5%), Cruxpool, WoolyPooly, RavenMiner, Hiveon, Suprnova | T-Rex, GMiner, TeamRedMiner, NBMiner, kawpowminer — all active 2026 | **HIGH** |
| 3 | **Conflux (CFX)** | Octopus / GPU (NVIDIA only) | $20M–$35M | Binance, OKX, KuCoin, Gate.io, HTX (~50 exchanges) ⚠️ *Binance accepts BSC bridge only — native chain payout won't credit directly* | **$80–$130/day** (GPU) | F2Pool, HeroMiners, 2Miners, woolypooly, Cruxpool | T-Rex, GMiner, NBMiner (NVIDIA only for Octopus) — active 2026 | **MED-HIGH** |
| 4 | **Firo (FIRO)** | FiroPoW / GPU | $400K–$700K | Binance, KuCoin, Gate.io, MEXC, Bitfinex | **$30–$55/day** (GPU) | 2Miners, Cruxpool, HeroMiners, woolypooly | T-Rex, GMiner, NBMiner — active 2026 | **MEDIUM** |
| 5 | **Ergo (ERG)** | Autolykos v2 / GPU (ASIC-resistant) | $130K–$180K | Gate.io, KuCoin, CoinEx, Bitget, MEXC (~7 exchanges) | **$20–$40/day** (GPU) ⚠️ *Gemini's $91/day used RTX 3080 baseline — normalized down* | 2Miners (1%), HeroMiners, K1Pool (solo), Nanopool, woolypooly | lolMiner, T-Rex, NBMiner, SRBMiner — active 2026 | **MEDIUM** |
| 6 | **Iron Fish (IRON)** | FishHash / GPU | $12K–$30K | KuCoin, Gate.io | **$25–$45/day** (GPU) | HeroMiners, Kryptex, 2Miners | Rigel v1.22.3, SRBMiner-Multi v3.1.6 — active 2026 | **MEDIUM** |
| 7 | **Clore.ai (CLORE)** | KawPow + compute rental / GPU | $750K–$1.15M | MEXC, Gate.io, Bybit | **$30–$120/day** ⚠️ *Wide range — mixes PoW + compute-rental economics. Revenue not purely PoW-comparable* | Rplant, Kryptex | Rigel, BZMiner — active 2026 | **MEDIUM** |
| 8 | **Zano (ZANO)** | ProgPowZ / GPU | $650K–$1.3M | MEXC, TradeOgre, others ⚠️ *Verify current listings* | **$20–$60/day** (GPU) | Active pools on MiningPoolStats — verify | lolMiner, SRBMiner — verify activity | **MED-HIGH** ⚠️ *ChatGPT addition — verify independently* |

---

## Tier 2 — Speculative / Microcap
> Technically valid PC-mining candidates but thin liquidity, high volatility, or data uncertainty

| # | Coin | Algorithm / Type | Normalized 24h Vol | Key Exchanges | Gross Rev/day per 1K avg PCs | Active Mining Pools | Mining Software (last 12mo) | Confidence |
|---|---|---|---|---|---|---|---|---|
| 9 | **Zephyr (ZEPH)** | RandomX / CPU | $80K–$130K | MEXC ($60K), XT.com, Nonkyc.io ⚠️ *v8 hardfork caused temporary exchange disruption May 2026* | **$25–$60/day** (CPU) | HeroMiners, MiningOcean, SoloPool.org, pool.zephyrprotocol.com | XMRig v6.26.0 (works directly) — active 2026 | **MEDIUM** |
| 10 | **Dynex (DNX)** | DynexSolve / GPU (PoUW) | $30K–$80K | MEXC ($19K), Gate.io, Uniswap V3 (bridged) ⚠️ *Paragon Program transition — project-risk flag* | **$8–$20/day** (GPU) | HeroMiners, NeuroPool, Acc-Pool, Hiveon | SRBMiner, OneZeroMiner, DynexSolve miner — active 2026 | **MEDIUM** |
| 11 | **Nexa (NEXA)** | NexaPow / GPU | $20K–$60K | MEXC, CoinEx, Bitget, BitMart, BingX ⚠️ *Halving June 2026 — reward drops 10M → 5M NEXA/block* | **$5–$15/day** (GPU) | 2Miners, f2pool, HeroMiners, Kryptex, Vipor | Rigel, lolMiner — active 2026 | **MED-LOW** |
| 12 | **Salvium (SAL)** | RandomX / CPU | $50K–$100K | MEXC, CoinEx | **$5–$15/day** (CPU) | HeroMiners, Kryptex Pool, MiningOcean | XMRig v6.26.0 (works directly) — active 2026 | **LOW-MED** |
| 13 | **Neoxa (NEOX)** | KawPow / GPU | $5K–$12K | CoinEx, LBank, XeggeX ⚠️ *Requires 3+ GB VRAM* | **$1–$6/day** (GPU) | 2Miners, HeroMiners, Flypool, woolypooly | T-Rex, GMiner, NBMiner, kawpowminer — active 2026 | **LOW** |
| 14 | **Dero (DERO)** | AstroBWT v3 / CPU | $3K–$8K | TradeOgre, XeggeX ⚠️ *Very thin liquidity* | **$2–$7/day** (CPU) ⚠️ *ARM CPUs outperform GPUs on AstroBWT* | HeroMiners, MiningOcean | Dero official miner, XMRig AstroBWT fork ⚠️ *Verify repo activity — may be >12 months* | **LOW** |
| 15 | **Neurai (XNA)** | KawPow / GPU | $50K–$100K | Active listings — verify | **$2–$10/day** (GPU) | Active pools — verify via MiningPoolStats | KawPow stack (T-Rex, GMiner, NBMiner) — verify activity | **MEDIUM** ⚠️ *ChatGPT addition — verify independently* |
| 16 | **Epic Cash (EPIC)** | Multi-algo: RandomX + ProgPoW + Cuckoo / CPU+GPU | $35K–$45K | Limited CEX listings — verify | **$2–$12/day** (varies by algo) | Active pools — verify | XMRig (RandomX mode), ProgPoW miners | **MED-LOW** ⚠️ *ChatGPT addition — verify independently* |
| 17 | **Raptoreum (RTM)** | GhostRider / CPU | $25K–$40K | CoinEx, TradeOgre, limited others | **$1–$8/day** (CPU) | 2Miners, HeroMiners — verify activity | XMRig (GhostRider support), SRBMiner | **LOW-MED** ⚠️ *ChatGPT addition — verify independently* |

---

## Tier 3 — Edge Cases / Human Review Required
> Technically mineable on PC in some conditions but with significant caveats — do not treat as clean PC-mining candidates

| # | Coin | Algorithm | Issue | Vol Est. | Rev Est. | Decision |
|---|---|---|---|---|---|---|
| 18 | **Ethereum Classic (ETC)** | Etchash / GPU | ASIC-heavy (Antminer E11 9 GH/s vs 100 MH/s GPU). GPU mining net-negative at ≥$0.10/kWh. Only viable with subsidized power. | $100M–$200M | $20–$60/day gross — net often poor | **Exclude from PC list unless power cost <$0.05/kWh** |
| 19 | **Alephium (ALPH)** | Blake3 / GPU | Iceriver ASIC deployment pushed difficulty >262 TH/s — consumer GPU yield has collapsed. Both Claude and Gemini confirm exclusion after correction. | $150K–$300K | $0–$10/day net likely | **Exclude — ASIC dominated** |
| 20 | **Beam (BEAM — Mimblewimble)** | BeamHashIII / GPU | ⚠️ Critical: two "BEAM" tokens exist. Mineable BEAM = Mimblewimble privacy chain. Non-mineable BEAM = onbeam.com gaming token. Do NOT use aggregated BEAM volume — it includes the wrong token. | $20K–$80K (mineable BEAM only) | $2–$8/day | **Include only with strict ticker/chain verification** |
| 21 | **Vertcoin (VTC)** | Verthash / GPU ⚠️ *NOT Lyra2REv3 — Gemini was stale* | Mining software (Verthash-Miner) may be at edge of 12-month update window. Low profitability. | $2K–$10K | $1–$7/day | **Niche only — verify software recency** |
| 22 | **Qubic (QUBIC)** | Useful-PoW / CPU (non-standard) | Mining model is non-standard compute system — not comparable to classic PoW. Revenue cannot be normalized cleanly. | $1.7M–$2.3M | Cannot normalize | **Edge — model requires separate analysis** |
| 23 | **VerusCoin (VRSC)** | VerusHash / CPU | Technically mineable but public exchange volume appears <$5K/day. Liquidity likely insufficient for meaningful sellthrough. | $500–$5K visible | $1–$10/day | **Low-confidence edge — verify OTC/community liquidity** |
| 24 | **Meowcoin (MEWC)** | KawPow / GPU | Technically valid but volume extremely thin. Only relevant if very thin microcaps are in scope. | $5K–$15K | $1–$5/day | **Include only if thin microcaps accepted** |

---

## Tier 4 — Excluded
> Confirmed ASIC-dominated, trading-inactive, or mining-deprecated

| Coin | Reason | Confidence |
|---|---|---|
| **Flux (FLUX)** | Legacy ZelHash PoW mining ended Oct 25, 2025 (Flux v9.0.0). Post-migration mining mechanism for consumer PC unconfirmed. | HIGH |
| **Kaspa (KAS)** | Completely ASIC-dominated (Bitmain KS5 Pro ~15–21 TH/s vs RTX 4090 ~2.2 GH/s — ~10,000× gap). GPU mining unprofitable. | HIGH |
| **Bitcoin (BTC)** | SHA-256 ASIC-only since ~2014. Consumer yield infinitesimal. | 99% |
| **Litecoin (LTC) / Dogecoin (DOGE)** | Scrypt ASIC-only, merged-mined industrially. | 99% |
| **Zcash (ZEC)** | Equihash ASIC-dominated (Z15 series). GPU yields negligible. | HIGH |
| **Dash (DASH)** | X11 ASIC-only. | HIGH |
| **Pyrin (PYI)** | Trading stopped >28 days ago on all exchanges. Active mining but no liquid market. | 80% |
| **Karlsen (KLS)** | Trading stopped >25 days ago on all exchanges. Same status as Pyrin. | 80% |
| **Wownero (WOW)** | Trading stopped ~22 days ago. May be temporary listing freeze — re-check before acting. | 70% |
| **Aeon (AEON)** | Only ~$8/day volume on TradeOgre — fails active trading threshold. | HIGH |
| **Haven (XHV)** | Exchange support essentially dead in 2026. Negligible liquidity. | 70% |

---

## Conflict Resolution Summary

| Conflict | Claude | Gemini | Verdict |
|---|---|---|---|
| XMR — Binance listing | Correctly delisted Feb 2024 | Incorrectly listed as active | **Claude correct** |
| XMR — Revenue | ~$216/day (Ryzen 5) | ~$389/day (Ryzen 9) | Not a conflict — hardware explains difference. Normalized: **$210–$240/day** |
| RVN — Revenue | ~$52/day (RTX 3060) | ~$215/day (RTX 3080) | Hardware + halving timing explains difference. Normalized: **$45–$70/day** |
| ERG — Network hashrate | Conservative | Claims 1.13–1.40 EH/s | **Likely a unit error (probably TH/s)** — treat as unverified |
| ALPH — Inclusion | Included (cautious) | Excluded (ASIC) | **Gemini correct** — downgraded to Tier 4 |
| VTC — Algorithm | Verthash ✅ | Lyra2REv3 ❌ stale | **Claude correct** |
| FLUX — Inclusion | Excluded ✅ (mining ended) | Included ❌ (stale data) | **Claude correct** |
| BEAM — Volume | Flagged name collision ✅ | No flag ❌ | **Claude correct** — separate token identity required |
| ETC — Inclusion | Edge/excluded ✅ | Included ❌ | **Claude more appropriate** for consumer-PC framing |
| IRON — Discovery | Missed ❌ | Found ✅ | **Gemini addition** — added to Tier 1 |
| CLORE — Discovery | Missed ❌ | Found ✅ | **Gemini addition** — added to Tier 1 |

---

## Final Classification Summary

| Tier | Coins | Count |
|---|---|---|
| **Tier 1 — Core candidates** | XMR, RVN, CFX, FIRO, ERG, IRON, CLORE, ZANO | 8 |
| **Tier 2 — Speculative microcap** | ZEPH, DNX, NEXA, SAL, NEOX, DERO, XNA, EPIC, RTM | 9 |
| **Tier 3 — Edge / human review** | ETC, ALPH, BEAM, VTC, QUBIC, VRSC, MEWC | 7 |
| **Tier 4 — Excluded** | FLUX, KAS, BTC, LTC, DOGE, ZEC, DASH, PYI, KLS, WOW, AEON, XHV | 12 |
| **Total evaluated** | | **36** |

---

## Data Confidence Overview

| Metric | Overall Confidence | Notes |
|---|---|---|
| Coin classifications (Tier 1/2/3/4) | ~78% | ChatGPT figure; conflict corrections ~88% |
| 24h volume figures | ~70% | Snapshot data — volatile day-to-day |
| Revenue estimates (gross) | ~55–65% | Change constantly with price, difficulty, fees |
| Exchange listings | ~80% | Some coins had recent delistings — verify before acting |
| Mining software recency | ~85% | Most verified active 2026; VTC and DERO are edge cases |
| ChatGPT-only additions (ZANO, XNA, EPIC, RTM, QUBIC, VRSC, MEWC) | ~60% | Not independently verified by Claude or Gemini — require separate verification pass |

---

## Key Flags for Part 2 Planning

- **CFX payout caveat**: Binance accepts only BSC-bridged CFX. Native-chain mining pool payouts won't credit directly — requires bridge step.
- **CLORE revenue**: Mixes PoW + AI compute-rental economics. Revenue model is not purely hashrate-based — model separately.
- **Privacy coin liquidity risk**: XMR, ZEPH, IRON all face regulatory delisting pressure in some jurisdictions. Miner conversion to fiat may require P2P routes.
- **NEXA halving June 2026**: Block reward halves — profitability calculations will change materially.
- **Microcap slippage**: For SAL, DERO, NEOX, EPIC, MEWC, RTM, VRSC — mining revenue may be partially or fully erased by sell slippage on thin markets.
- **ASIC covert risk**: Any GPU coin without expanding memory-hard constraints (e.g., growing DAG files like KawPow) is at persistent unquantifiable risk of hidden ASIC deployment (see ALPH as a case study).

---

*End of Part 1 Research — Ready for Part 2: Web Mining Solutions & Implementation Research*