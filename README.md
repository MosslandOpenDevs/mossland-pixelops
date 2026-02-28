# Mossland PixelOps

A pixel-art **living operations map** that visualizes Mossland's services, agents, and governance in real time.

Instead of charts-first dashboards, PixelOps renders a small 2D world (HQ / town / districts) where agents appear as characters and activity appears as motion, icons, and timelines.

![Status](https://img.shields.io/badge/status-pre--alpha-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

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

## World Map (UX Concept)

The pixel world is divided into four districts:

| District | Data Source | Role |
|----------|-------------|------|
| **Agora Hall** | Algora | Debates, decision packets, voting prompts |
| **AO Factory** | Agentic Orchestrator | Signals → debate → plan → backlog/PR |
| **Bridge Lab** | Bridge-2026 | Reality signals & proof-of-outcome storyline |
| **OpenDevs Hub** | GitHub Events | Project tiles, build & release pulse |

A right-side **provenance timeline** links every visual event to its source.

**Modes:** `NOW` (live) · `REPLAY` (time-travel) · `GOV` (governance filter)

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| 2D Engine | [Phaser 3](https://phaser.io/) | Actively maintained, React/TS integration, large ecosystem |
| UI Framework | React 18 + TypeScript | Component model for panels/overlays |
| State | Zustand | Lightweight, works well with game loops |
| Server | Node.js (Fastify) | Adapter ingestion, event relay, caching |
| Build | Vite + pnpm workspaces | Fast builds, monorepo support |
| Deploy | Vercel / Cloudflare Pages | Static SPA + serverless API routes |

## Project Structure

```
mossland-pixelops/
├── apps/
│   ├── client/          # Phaser + React SPA
│   └── server/          # Adapter ingestion & event relay API
├── packages/
│   ├── events/          # Common event schema & types
│   ├── adapters/        # GitHub, AO, Algora, Bridge adapters
│   └── world-model/     # Entity definitions, reducer, state
├── assets/              # License-clean sprites & tilesets
├── docs/
│   ├── architecture/    # Architecture docs
│   ├── decisions/       # ADRs (Architecture Decision Records)
│   └── DEVELOPMENT_PLAN.md
└── scripts/             # Dev tooling & utilities
```

## Data Sources

| Source | Type | Status |
|--------|------|--------|
| **GitHub Events** | Commits, PRs, Issues across MosslandOpenDevs | MVP |
| **Agentic Orchestrator** | 34-agent pipeline, REST API | MVP |
| **Algora** | Governance activity, deliberation artifacts | Post-MVP |
| **Bridge-2026** | Concept/spec signals (BUSL license constraints) | Post-MVP |
| On-chain governance | KPI endpoints | Future |

## MVP Scope

- Pixel world renderer with 10–20 agents
- Event ingestion from GitHub + AO REST (read-only)
- Click any agent/building → "What / Why / Source"
- Simple replay via buffered event log

## Non-Goals (Initial)

- No wallet actions, voting, or contract calls (read-only only)
- No scraping of paid assets or proprietary content

## Assets Policy

We borrow the *interaction pattern* from pixel-art agent visualizations, but ship exclusively with:
- Original Mossland-themed sprite packs, **or**
- Strictly open-licensed packs with clear attribution

See [docs/decisions/ADR-001-asset-licensing.md](docs/decisions/ADR-001-asset-licensing.md) for details.

## Getting Started

> **Pre-alpha** — project scaffolding is in progress.

```bash
# Prerequisites: Node.js ≥ 20, pnpm ≥ 9
pnpm install
pnpm dev        # Start client + server in dev mode
```

## Contributing

Contributions are welcome! Please read the development plan and open an issue before starting work on a new feature.

## License

MIT — see [LICENSE](LICENSE) for details.
