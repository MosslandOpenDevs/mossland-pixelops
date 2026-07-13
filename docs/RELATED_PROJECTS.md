# Related Projects — PixelOps & `pixel-agent-lab`

This document maps how **Mossland PixelOps** (this repository) relates to
[`pixel-agent-lab`](https://github.com/MosslandOpenDevs/pixel-agent-lab) — the
Mossland pixel-art dashboard that is **live in production** — and to the three
backend services both of them visualize.

> **TL;DR** — `pixel-agent-lab` is the *shipping* governance monitor
> (**[monitor.moss.land](https://monitor.moss.land)**). `mossland-pixelops` is a
> from-scratch, event-sourced re-architecture of the same idea that is still at
> the scaffold stage. They are **sibling projects that visualize the same three
> services**, not the same codebase.

---

## The shared subject: Mossland's three-service governance loop

Both projects render the same operational pipeline. Each stage is an independent
Mossland service with its own repository:

| Stage | Service | Responsibility | Repository |
|-------|---------|----------------|------------|
| **Sense & Detect** | Algora | Multi-source signal collection, issue detection & prioritization | [MosslandOpenDevs/Algora](https://github.com/MosslandOpenDevs/Algora) |
| **Debate & Plan** | AO (Agentic Orchestrator) | Multi-agent debate → Ideas / Plans / Projects | [MosslandOpenDevs/agentic-orchestrator](https://github.com/MosslandOpenDevs/agentic-orchestrator) |
| **Execute & Verify** | Bridge | Execution/delegation, human voting, outcome proof & trust scoring | [MosslandOpenDevs/bridge-2026](https://github.com/MosslandOpenDevs/bridge-2026) |

The canonical description of the loop and the data hand-offs between these
services lives in `pixel-agent-lab`'s
[`docs/mossland-services-overview.md`](https://github.com/MosslandOpenDevs/pixel-agent-lab/blob/main/docs/mossland-services-overview.md):

```
Signals → Issues → Debates/Plans → Execution/Delegation → Outcomes/Proof → Feedback
   └────── Algora ──────┘  └──── AO ────┘  └──────────── Bridge ───────────┘
```

Both PixelOps and `pixel-agent-lab` are, at heart, **read-only visual front-ends
over this loop**. Where they differ is *how* they get the data and *how much
architecture* sits behind the pixels.

---

## Side-by-side comparison

| | **`pixel-agent-lab`** (live) | **`mossland-pixelops`** (this repo) |
|---|---|---|
| **Role** | Shipping production monitor | Pre-alpha architectural reimagining |
| **Live URL** | **[monitor.moss.land](https://monitor.moss.land)** | Not deployed |
| **Data source** | **Real** Algora/AO/Bridge APIs, polled every 15 s (`/algora-api`, `/ao-api`, `/bridge-api` via reverse proxy) | **Mock generator only** — synthetic events at 0.5–10 evt/s |
| **Stack** | Vite · TypeScript · Phaser 3 — vanilla static SPA, *no framework* | pnpm monorepo · Phaser 3 · **React 19** · **Zustand** |
| **Architecture** | Direct per-service API clients + procedural textures (`TextureFactory`) | Event-sourced: `Event → reducer → world state → render` (`@pixelops/events`, `@pixelops/world-model`) |
| **Visual metaphor** | "Space logistics center" — conveyor belts + pixel agents, three **independent zones** | "Living operations map" — town/HQ with four districts |
| **Domain depth** | High: Algora 9-stage pipeline / 38 agents, AO Diverge→Converge→Plan rings with score thresholds, Bridge L0→L4 + Trust & Outcomes | Conceptual: 4 districts, generic agent idle/walk/work states driven by an event schema |
| **Deploy tooling** | nginx reverse-proxy example, PM2 (`ecosystem.config.cjs`), CORS reflection for moss.land widgets | None yet (SPA-only) |
| **Assets** | Procedurally generated in code | Reference sprite/tileset packs (MetroCity CC0, pixel-agents MIT, The Ville Apache-2.0, commercial tilesets) |
| **License** | None declared | MIT |
| **Primary docs language** | Korean | English (+ Korean translations) |
| **Maturity** | Actively developed through mid-2026 | 3-commit scaffold (Feb–Mar 2026) |

---

## Timeline & evidence

The two repositories were created within days of each other in the same org
(`MosslandOpenDevs`), which is the strongest signal that they are deliberate
siblings rather than a fork:

| Repo | Created | Last pushed | Commits (approx.) | Deployed |
|------|---------|-------------|-------------------|----------|
| `mossland-pixelops` | 2026-02-28 | 2026-03-01 | 3 (scaffold) | No |
| `pixel-agent-lab` | 2026-03-11 | 2026-07-01 | Ongoing | Yes — monitor.moss.land |

Observations:

- **PixelOps came first, then stalled.** It was created ~11 days *before*
  `pixel-agent-lab` but stopped at an initial scaffold (docs, event schema, a
  mock-driven Phaser+React client). Its own docs describe an `apps/server` and
  `packages/adapters` layer that **were never committed**.
- **`pixel-agent-lab` shipped and kept moving.** It went from creation in March
  to a live, reverse-proxied, PM2-managed deployment consuming real service APIs,
  with continued pushes into July.

---

## Interpretation

> The following is an informed reading of the repository evidence, not an
> official Mossland statement. Confirmed facts and inferred intent are separated
> below.

**Confirmed (from repo metadata, source, and the live site):**
- Both projects visualize the **same** Algora → AO → Bridge governance loop.
- `pixel-agent-lab` is the one **actually serving users** at monitor.moss.land,
  reading **live** service data.
- `mossland-pixelops` currently runs on **mock data only** and has no server or
  adapter layer despite its docs describing one.

**Inferred (a plausible narrative, not verified):**
- PixelOps reads like the **"north-star" re-architecture**: it trades the
  monitor's pragmatic, hard-wired API clients for a **deterministic,
  event-sourced, provenance-first** design (event log → reducer → replayable
  world state) with a richer React UI, filters, and planned `NOW` / `REPLAY` /
  `GOV` modes. `pixel-agent-lab` is the **pragmatic build that shipped** while
  the more ambitious rewrite paused at the scaffold.

If PixelOps is resumed, the most natural convergence path is for its (not-yet-
built) `packages/adapters` + `apps/server` layer to consume the **same live
service endpoints** `pixel-agent-lab` already speaks to (`/algora-api`,
`/ao-api`, `/bridge-api`), replacing the mock generator — at which point PixelOps
becomes a superset: the live monitor's data, plus event-sourcing, provenance
links, and time-travel replay.

---

## What each is best for today

- **Want to see live Mossland governance status?** → Use
  **[monitor.moss.land](https://monitor.moss.land)** (`pixel-agent-lab`).
- **Want the event-schema / reducer / replay architecture and a React-based
  "living ops map"?** → This repo (`mossland-pixelops`) — currently a mock-driven
  prototype.

---

## Sources

- [`MosslandOpenDevs/pixel-agent-lab`](https://github.com/MosslandOpenDevs/pixel-agent-lab) — README, `docs/mossland-services-overview.md`, `deploy/nginx.conf.example`, source tree
- [`MosslandOpenDevs/mossland-pixelops`](https://github.com/MosslandOpenDevs/mossland-pixelops) — this repository (source, docs, git history)
- [`MosslandOpenDevs/Algora`](https://github.com/MosslandOpenDevs/Algora), [`agentic-orchestrator`](https://github.com/MosslandOpenDevs/agentic-orchestrator), [`bridge-2026`](https://github.com/MosslandOpenDevs/bridge-2026) — the visualized services
- Live deployment: [monitor.moss.land](https://monitor.moss.land)
