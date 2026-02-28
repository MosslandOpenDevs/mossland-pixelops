# Mossland PixelOps — Development Plan

> Living document. Updated as milestones are reached.

## Overview

PixelOps is built in **six phases**, from foundation to launch.
Each phase delivers a testable increment.

---

## Phase 0 — Foundation (Weeks 1–2)

**Goal:** Runnable scaffold with an empty pixel world.

| Task | Details |
|------|---------|
| Monorepo scaffolding | pnpm workspaces: `apps/client`, `apps/server`, `packages/*` |
| Phaser + React integration | Vite template, Phaser 3 game embedded in React shell |
| TypeScript strict mode | Shared `tsconfig.base.json`, per-package extends |
| CI pipeline | GitHub Actions: lint → type-check → test → build |
| Empty world render | Load a placeholder tilemap, camera controls, 1 test sprite |
| Event schema (v0) | `packages/events`: `PixelOpsEvent` type + validation (Zod) |
| Dev tooling | ESLint flat config, Prettier, Husky pre-commit |

**Exit criteria:** `pnpm dev` opens a browser with a scrollable pixel map and one animated sprite.

---

## Phase 1 — Core Engine (Weeks 3–5)

**Goal:** Deterministic event → state → render pipeline.

| Task | Details |
|------|---------|
| World model package | `packages/world-model`: Entity types (`Agent`, `Building`, `Pipeline`, `Proposal`, `Signal`, `Artifact`) |
| Event reducer | Pure function: `(state, event) → state`. Fully deterministic. |
| Agent renderer | Spawn agents on map, idle/walk/action animations driven by state |
| Building renderer | District buildings with state indicators (idle / active / alert) |
| Side panel (React) | Click entity → panel shows: name, status, last N events, provenance links |
| Event bus | In-memory pub/sub; adapters publish, renderer subscribes |
| Debug overlay | FPS counter, event rate, entity count (toggle with hotkey) |

**Exit criteria:** Feed mock events → agents move and buildings animate → click shows details panel with event history.

---

## Phase 2 — Adapters & Ingestion (Weeks 6–8)

**Goal:** Live data flows from GitHub and Agentic Orchestrator into the pixel world.

| Task | Details |
|------|---------|
| Adapter interface | `IAdapter { start(), stop(), onEvent(cb) }` contract in `packages/adapters` |
| GitHub adapter | Poll / webhook: commits, PRs, issues → `PixelOpsEvent` |
| AO adapter | REST polling: agent states, pipeline stages, debate results |
| Server ingestion | `apps/server` (Fastify): adapter runner, event normalization, WebSocket relay |
| Client connection | WebSocket client in `apps/client`; reconnect + backpressure handling |
| Event persistence | Append-only event log (SQLite for dev, Postgres option for prod) |
| Adapter health dashboard | Server endpoint + client indicator showing adapter status |

**Exit criteria:** Real GitHub commits and AO pipeline events appear as agent/building animations within seconds.

---

## Phase 3 — Interaction & Filters (Weeks 9–10)

**Goal:** The map becomes navigable and filterable.

| Task | Details |
|------|---------|
| District map design | Four districts laid out: Agora Hall, AO Factory, Bridge Lab, OpenDevs Hub |
| Entity tooltips | Hover → quick summary; click → full detail panel |
| Provenance timeline | Right-side panel: chronological event list, each row links to source URL |
| Filter bar | Filter by: time window, source adapter, entity type |
| GOV mode | One-click filter showing governance-only events (issues, debates, votes, decisions) |
| NOW mode | Default live view with auto-scroll to latest events |
| Keyboard shortcuts | Navigation, mode switching, panel toggle |

**Exit criteria:** User can filter to governance events, click an agent, and follow a provenance link to the source artifact.

---

## Phase 4 — Replay & Performance (Weeks 11–12)

**Goal:** Time-travel replay and production-grade performance.

| Task | Details |
|------|---------|
| Replay engine | Rebuild world state from event log at arbitrary timestamp |
| Replay controls | Play / pause / speed (1×, 2×, 5×) / scrub timeline |
| REPLAY mode | UI mode with timeline scrubber, date-range picker |
| Spritesheet optimization | Atlas packing, lazy loading, texture compression |
| Render budget | Profile & optimize: batched draws, culling off-screen entities |
| Graceful degradation | Detect low-end devices → reduce particle effects, cap entity count |
| Load testing | Simulate 500+ events/min; measure FPS and memory |

**Exit criteria:** Replay last 24h of events smoothly; maintain 60 fps with 50 concurrent entities on mid-tier hardware.

---

## Phase 5 — Extended Adapters & Assets (Weeks 13–14)

**Goal:** Full data coverage and production-ready assets.

| Task | Details |
|------|---------|
| Algora adapter | Governance activity feed, deliberation artifacts |
| Bridge adapter | Read-only metadata + spec milestones (respect BUSL license) |
| Asset creation | Original Mossland-themed sprites or curated open-licensed packs |
| Tilemap polish | Final district layouts, decorations, ambient animations |
| Sound design (optional) | Subtle ambient SFX for events (toggleable) |
| Attribution page | License info for all assets and libraries |

**Exit criteria:** All four districts populated with real data; all assets are license-clean with attribution.

---

## Phase 6 — Launch Readiness (Weeks 15–16)

**Goal:** Deploy, document, and announce.

| Task | Details |
|------|---------|
| Production deployment | Vercel/Cloudflare: SPA + serverless API routes |
| Environment config | Secrets management, rate limiting, CORS |
| Monitoring | Error tracking (Sentry), uptime checks, adapter health alerts |
| Documentation | User guide, adapter development guide, contribution guide |
| Security review | No secrets in client, CSP headers, input sanitization |
| Community launch | Announcement post, demo video/GIF, feedback channel |

**Exit criteria:** Public URL live, docs published, community notified.

---

## Milestone Summary

| Milestone | Phase | Target | Key Deliverable |
|-----------|-------|--------|-----------------|
| M0: Scaffold | 0 | Week 2 | Empty world renders in browser |
| M1: Engine | 1 | Week 5 | Mock events drive agent animations |
| M2: Live Data | 2 | Week 8 | GitHub + AO events flow in real time |
| M3: Interactive | 3 | Week 10 | Filters, provenance links, GOV mode |
| M4: Replay | 4 | Week 12 | Time-travel replay at 60 fps |
| M5: Full Coverage | 5 | Week 14 | All adapters + license-clean assets |
| M6: Launch | 6 | Week 16 | Public deployment |

---

## Tech Decisions Log

Key architectural decisions are recorded as ADRs in [`docs/decisions/`](decisions/).

| ADR | Title | Status |
|-----|-------|--------|
| 001 | Asset licensing policy | Accepted |
| 002 | Phaser 3 as 2D engine | Accepted |
| 003 | Event schema design | Proposed |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| AO REST API changes or downtime | Data gaps | Adapter circuit breaker + cached last-known state |
| Algora feed not yet available | Delayed Agora Hall | Stub adapter with mock data; integrate when ready |
| Bridge-2026 BUSL license constraints | Limited data use | Read-only metadata only; no code/spec reproduction |
| Asset licensing violations | Legal risk | Strict review process; ADR-001 policy |
| Performance on low-end devices | Poor UX | Progressive degradation; performance budget in CI |
