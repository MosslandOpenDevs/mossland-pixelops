# Mossland PixelOps

A pixel-art **living operations map** that visualizes Mossland's services, agents, and governance in real time.

Instead of charts-first dashboards, PixelOps renders a small 2D world where agents appear as characters and activity appears as motion, icons, and timelines.

![Status](https://img.shields.io/badge/status-pre--alpha-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Data](https://img.shields.io/badge/data-mock%20only-lightgrey)

> **Looking for the live Mossland monitor?**
> A sibling project, [`pixel-agent-lab`](https://github.com/MosslandOpenDevs/pixel-agent-lab), already ships a production governance dashboard at **[monitor.moss.land](https://monitor.moss.land)** using **live** service data. PixelOps is a separate, earlier-stage re-architecture of the same idea. See **[Related Projects](#related-projects)** for how the two fit together.

## Current Status

PixelOps is a **pre-alpha scaffold**. It runs entirely on a **mock event generator** — there is no server, no live data, and no deployment yet.

**What works today**

- ✅ Phaser + React client boots via `pnpm dev`
- ✅ Deterministic core pipeline: `Event → reducer → world state → render` (`@pixelops/events`, `@pixelops/world-model`)
- ✅ Mock event generator (0.5–10 evt/s, pausable) drives agent idle / walk / work animations
- ✅ Runtime map switching across three reference maps (The Ville + two office levels)
- ✅ Click an agent → side panel with its recent events and provenance link
- ✅ Debug overlay (FPS / entity count)

**Not built yet** (described in the docs as the target architecture)

- ⛔ `apps/server` — adapter ingestion / event relay
- ⛔ `packages/adapters` — GitHub / AO / Algora / Bridge live adapters
- ⛔ Live data of any kind (currently mock only)
- ⛔ `NOW` / `REPLAY` / `GOV` modes, filters, provenance timeline scrubber

## Why PixelOps?

- **Instant situational awareness** — See what's happening *now* without reading logs.
- **Governance transparency** — Make deliberation → decision → execution legible to humans.
- **Community storytelling** — Turn ecosystem work into a shareable, playful interface without sacrificing auditability.

## Design Philosophy

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Truth over vibes** | Every animation is backed by a logged event and a source link. |
| 2 | **Provenance-first UX** | "Show me the proof" is always one click away. |
| 3 | **Deterministic state** | `Event Log → Reducer → World State → Render` |
| 4 | **Readable at a glance** | The main map answers "What is happening now?" |
| 5 | **Composable adapters** | Each system produces a common event schema. |
| 6 | **Safe by default** | Read-only, public-safe, no secrets ingested. |
| 7 | **Performance is a feature** | 60 fps target, graceful degradation. |

## The Mossland Ecosystem PixelOps Visualizes

PixelOps is a front-end over Mossland's three-service governance loop. Each service is an independent repository; PixelOps groups the world into one **district per service** (plus a dev-activity district):

| District | Backing service | Role | Repository |
|----------|-----------------|------|------------|
| **Governance Plaza** (Agora Hall) | Algora | Debates, decision packets, voting prompts | [MosslandOpenDevs/Algora](https://github.com/MosslandOpenDevs/Algora) |
| **AO Quarter** (AO Factory) | Agentic Orchestrator | Signals → debate → plan → backlog/PR | [MosslandOpenDevs/agentic-orchestrator](https://github.com/MosslandOpenDevs/agentic-orchestrator) |
| **Bridge District** (Bridge Lab) | Bridge | Reality signals, execution & proof-of-outcome | [MosslandOpenDevs/bridge-2026](https://github.com/MosslandOpenDevs/bridge-2026) |
| **Dev Hub** (OpenDevs Hub) | GitHub Events | Project tiles, build & release pulse | [MosslandOpenDevs](https://github.com/MosslandOpenDevs) |

The governance loop these services form:

```
Signals → Issues → Debates/Plans → Execution/Delegation → Outcomes/Proof → Feedback
   └───── Algora ─────┘   └── AO ──┘   └──────────── Bridge ───────────┘
```

> **Current rendering:** the district names above are the design concept. The
> current build renders a reference map (The Ville or an office level) and
> scatters mock-driven agents across it; district identity is entity metadata,
> not yet a bespoke on-map region. A right-side **provenance timeline** and the
> `NOW` / `REPLAY` / `GOV` modes are planned, not yet implemented.

## Related Projects

`mossland-pixelops` is one of **two** Mossland pixel-art visualizations of the same governance loop:

| | [`pixel-agent-lab`](https://github.com/MosslandOpenDevs/pixel-agent-lab) | `mossland-pixelops` (this repo) |
|---|---|---|
| **Status** | **Live** at [monitor.moss.land](https://monitor.moss.land) | Pre-alpha scaffold |
| **Data** | Real Algora/AO/Bridge APIs (15 s polling) | Mock generator only |
| **Stack** | Vite + Phaser 3 (vanilla SPA) | Phaser 3 + React 19 + Zustand (monorepo) |
| **Approach** | Direct API clients, "space logistics center" visual | Event-sourced (schema → reducer → replay), "living ops map" |

In short: **`pixel-agent-lab` is the shipping monitor; PixelOps is the more ambitious, event-sourced re-architecture that is still at the scaffold stage.** A full breakdown of the relationship, timeline, and likely convergence path is in **[docs/RELATED_PROJECTS.md](docs/RELATED_PROJECTS.md)**.

## Tech Stack

| Layer | Choice | Status |
|-------|--------|--------|
| 2D Engine | [Phaser 3](https://phaser.io/) | ✅ In use |
| UI Framework | React 19 + TypeScript | ✅ In use |
| State | [Zustand](https://github.com/pmndrs/zustand) | ✅ In use |
| Build | Vite + pnpm workspaces | ✅ In use |
| Event schema | Zod (`@pixelops/events`) | ✅ In use |
| Server | Node.js (Fastify) — adapter ingestion, event relay | 🔜 Planned |
| Deploy | Vercel / Cloudflare Pages | 🔜 Planned |

## Project Structure

```
mossland-pixelops/
├── apps/
│   └── client/          # Phaser + React SPA  (✅ implemented)
│       └── src/
│           ├── game/        # Phaser scenes, entities, maps, pathfinding
│           ├── mock/        # Mock event generator + agent pool
│           ├── store/       # Zustand world store
│           └── ui/          # React panels & overlays
├── packages/
│   ├── events/          # Common event schema & types  (✅ implemented)
│   └── world-model/     # Entity definitions, reducer, districts  (✅ implemented)
├── assets/              # Asset attribution & download manifest
├── docs/
│   ├── architecture/    # Architecture docs
│   ├── decisions/       # ADRs (Architecture Decision Records)
│   ├── DEVELOPMENT_PLAN.md
│   ├── IMPLEMENTATION.md
│   └── RELATED_PROJECTS.md
└── scripts/             # Dev tooling & asset setup
```

> **Note:** `apps/server` and `packages/adapters` appear in the architecture docs
> and development plan as the target design, but are **not yet in the repository**.

## Data Sources

| Source | Type | Status in PixelOps |
|--------|------|--------------------|
| **Mock generator** | Synthetic events across all four sources | ✅ Active (the only data source today) |
| [**GitHub Events**](https://github.com/MosslandOpenDevs) | Commits, PRs, Issues across MosslandOpenDevs | 🔜 Planned adapter |
| [**Agentic Orchestrator**](https://github.com/MosslandOpenDevs/agentic-orchestrator) | Agent pipeline, REST API | 🔜 Planned adapter |
| [**Algora**](https://github.com/MosslandOpenDevs/Algora) | Governance activity, deliberation artifacts | 🔜 Planned adapter |
| [**Bridge**](https://github.com/MosslandOpenDevs/bridge-2026) | Reality signals, execution & outcome proof | 🔜 Planned adapter |

## MVP Scope

- Pixel world renderer with 10–20 agents ✅
- Deterministic event → state → render pipeline ✅
- Click any agent/building → "What / Why / Source" ✅
- Event ingestion from GitHub + AO REST (read-only) 🔜
- Simple replay via buffered event log 🔜

## Non-Goals (Initial)

- No wallet actions, voting, or contract calls (read-only only)
- No scraping of paid assets or proprietary content

## Assets Policy

We borrow the *interaction pattern* from pixel-art agent visualizations, but ship exclusively with:

- Original Mossland-themed sprite packs, **or**
- Strictly open-licensed packs with clear attribution

Reference assets currently used (see [assets/ATTRIBUTION.md](assets/ATTRIBUTION.md)):

- **MetroCity** character pack — CC0
- **[pixel-agents](https://github.com/pablodelucca/pixel-agents)** `walls.png` — MIT
- **[generative_agents](https://github.com/joonspk-research/generative_agents)** "The Ville" map — Apache-2.0
- LimeZu / Donarg interior tilesets — commercial, **downloaded separately**, never redistributed

See [docs/decisions/ADR-001-asset-licensing.md](docs/decisions/ADR-001-asset-licensing.md) for the full policy.

## Getting Started

> **Pre-alpha** — only the client runs, on mock data.

```bash
# Prerequisites: Node.js ≥ 20, pnpm ≥ 9
pnpm install
pnpm dev        # Starts the client (Vite) — opens the pixel world on mock data
```

Bundled reference maps (e.g. "The Ville") load out of the box. The commercial
office tilesets are gitignored — fetch them via [assets/downloads.txt](assets/downloads.txt)
and `scripts/download-assets.sh` if you want the office maps.

Useful scripts:

```bash
pnpm build      # Build all workspace packages
pnpm typecheck  # Type-check every package
pnpm lint       # ESLint
```

## Documentation

- [Implementation details](docs/IMPLEMENTATION.md) ([한국어](docs/IMPLEMENTATION.ko.md))
- [Architecture](docs/architecture/ARCHITECTURE.md) · [Event schema](docs/architecture/EVENT_SCHEMA.md)
- [Development plan](docs/DEVELOPMENT_PLAN.md)
- [Related projects (PixelOps vs. pixel-agent-lab)](docs/RELATED_PROJECTS.md)
- [Architecture Decision Records](docs/decisions/)

## Contributing

Contributions are welcome! Please read the [development plan](docs/DEVELOPMENT_PLAN.md) and open an issue before starting work on a new feature.

## License

MIT — see [LICENSE](LICENSE) for details.
