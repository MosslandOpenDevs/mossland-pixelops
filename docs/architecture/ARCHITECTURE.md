# Architecture Overview

> **Status:** This document describes the **target architecture**. The current
> build implements a **subset** — a mock-driven client with no server or
> adapters. See [**Current Implementation**](#current-implementation-what-runs-today)
> below for what actually runs, and [RELATED_PROJECTS.md](../RELATED_PROJECTS.md)
> for how this differs from the live sibling `pixel-agent-lab`.

## Current Implementation (what runs today)

Today PixelOps is a **client-only SPA** fed by a local mock generator. There is
no server, no network ingestion, and no external API contact.

```
┌─────────────────────────────────────────────────────────┐
│                     Client (SPA)                         │
│                                                          │
│   MockEventGenerator  ──►  reduceEvent()  ──►  Zustand   │
│   (@pixelops/... mock)     (@pixelops/       (worldStore)│
│                             world-model)          │      │
│                                                   ▼      │
│                                        Phaser 3 WorldScene│
│                                        (maps + agents)   │
│                                                   │      │
│                                        React UI (SidePanel,│
│                                        MockControls, Debug)│
└─────────────────────────────────────────────────────────┘
```

- **Data source:** `MockEventGenerator` emits synthetic `PixelOpsEvent`s at
  0.5–10 evt/s (pausable via `MockControls`).
- **Pipeline (real):** `Event → reduceEvent → Zustand store → Phaser render`.
  This is the deterministic core described below — it exists and works.
- **Rendering:** Phaser scenes `Boot → Preload → World`. `WorldScene` loads one
  of three reference maps (The Ville Tiled map, two office image maps) and
  scatters mock-driven agents that idle / walk (BFS) / work.
- **No WebSocket, no server, no persistence.** The event log lives in memory,
  capped at 200 entries.

The sections below describe where this is headed.

---

## Target System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (SPA)                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ Phaser 3 │  │  React   │  │   Provenance Panel    │  │
│  │  World   │◄─┤  Shell   │  │  (Timeline + Links)   │  │
│  │ Renderer │  │  + UI    │  │                       │  │
│  └────▲─────┘  └──────────┘  └───────────────────────┘  │
│       │                                                 │
│  ┌────┴──────────────────────────────────────────────┐  │
│  │              World State (Zustand)                 │  │
│  │   Event Log → Reducer → Entities + Districts      │  │
│  └────▲──────────────────────────────────────────────┘  │
│       │ WebSocket  (🔜 planned; today: local mock feed)  │
└───────┼─────────────────────────────────────────────────┘
        │
┌───────┼─────────────────────────────────────────────────┐
│       │        Server (Fastify) — 🔜 NOT YET BUILT       │
│  ┌────┴──────────────────────────────────────────────┐  │
│  │              Event Normalizer                     │  │
│  │         PixelOpsEvent validation (Zod)            │  │
│  └────▲─────────▲─────────▲─────────▲────────────────┘  │
│       │         │         │         │                   │
│  ┌────┴───┐ ┌───┴───┐ ┌───┴───┐ ┌───┴────┐             │
│  │ GitHub │ │  AO   │ │Algora │ │Bridge  │  🔜 adapters │
│  │Adapter │ │Adapter│ │Adapter│ │Adapter │  NOT YET BUILT│
│  └────┬───┘ └───┬───┘ └───┬───┘ └───┬────┘             │
│       │         │         │         │                   │
│  ┌────┴─────────┴─────────┴─────────┴────────────────┐  │
│  │            Event Store (append-only)               │  │
│  │         SQLite (dev) / Postgres (prod)             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        │         │         │         │
   GitHub API  AO REST   Algora    Bridge
                  API      API     metadata
```

> The live sibling project [`pixel-agent-lab`](https://github.com/MosslandOpenDevs/pixel-agent-lab)
> already implements a working version of the ingestion idea — it polls the real
> Algora/AO/Bridge APIs directly from a static SPA (no event store, no
> normalizer). PixelOps' target design is the more elaborate, event-sourced take.
> See [RELATED_PROJECTS.md](../RELATED_PROJECTS.md).

## Core Data Flow (target)

```
External APIs → Adapters → PixelOpsEvent → Normalizer → Event Store
                                                            │
                                              WebSocket relay
                                                            │
                                              Client Event Bus
                                                            │
                                              Reducer(state, event)
                                                            │
                                              World State (entities)
                                                            │
                                              Phaser Renderer
```

**Today**, the left half (`External APIs → … → WebSocket relay`) is replaced by a
local `MockEventGenerator` that publishes straight into the client event flow.
The right half (`Reducer → World State → Renderer`) is fully implemented.

**Key invariant:** The world state is a pure projection of the event log.
Given the same event sequence, the world state is identical (deterministic replay).

## Package Responsibilities

### `packages/events` — ✅ implemented
- `PixelOpsEvent` type definition and Zod schema
- Event type registry (enum of all known event types)
- Serialization/deserialization utilities

### `packages/world-model` — ✅ implemented
- Entity types — **`Agent` and `Building` are modeled today**; `Pipeline`,
  `Proposal`, `Signal`, `Artifact` exist only as `EntityKind` values on events
  (not yet stateful entities)
- World state type: map of entity ID → entity, plus event log + tick
- Reducer: `(WorldState, PixelOpsEvent) → WorldState` — deterministic
- District definitions (`Dev Hub`, `AO Quarter`, `Governance Plaza`,
  `Bridge District`) used for agent grouping

### `packages/adapters` — 🔜 planned (not yet in repo)
- `IAdapter` interface: `start()`, `stop()`, `onEvent(callback)`
- Per-source adapter implementations
- Rate limiting and caching utilities
- Health check contract

### `apps/client` — ✅ implemented (mock-fed)
- Phaser game scene management (`Boot → Preload → World`)
- React UI shell: `SidePanel`, `MockControls`, `ThemeSelector`, `DebugOverlay`
- Zustand store (`worldStore`) bridging world state to React + Phaser
- **Mock event generator** in place of a live WebSocket connection
- In-memory event buffer (no persistence)
- Runtime map switching (Tiled + image maps)

### `apps/server` — 🔜 planned (not yet in repo)
- Fastify HTTP + WebSocket server
- Adapter lifecycle management
- Event normalization and validation
- Event store read/write
- REST endpoints: health, event history, adapter status

## Key Design Decisions

### Why Phaser 3 (not Kaboom, PixiJS, etc.)?
- Kaboom is no longer maintained
- Phaser has official React/TypeScript templates
- Large ecosystem, active community, comprehensive docs
- Built-in tilemap support, sprite animation, camera system
- See [ADR-002](../decisions/ADR-002-phaser-engine.md)

### Why Zustand (not Redux)?
- Minimal boilerplate for game state
- Works outside React (Phaser scenes can subscribe directly)
- Devtools support for debugging

### Why Fastify (not Express)? — *applies to the planned server*
- Schema-based validation (aligns with Zod schemas)
- First-class WebSocket support via plugins
- Better performance characteristics

### Why append-only event store? — *applies to the planned server*
- Deterministic replay requires immutable event history
- Enables time-travel debugging
- Natural audit trail for governance transparency

## Security Model (target)

```
Public Internet → Client (SPA, no secrets)
                     ↕ WebSocket (read-only events)
                  Server (secrets here only)
                     ↕ Authenticated API calls
                  External Services
```

- **Client:** Zero secrets. All data received is already public-safe.
- **Server:** Holds API tokens. Never exposes raw tokens to client.
- **Adapters:** Read-only access only. No write operations to external services.
- **Event store:** Contains only public-safe data. PII is never ingested.

> **Today:** with no server and no external calls, PixelOps holds **no secrets
> anywhere** and contacts **no external services** — the client runs entirely on
> locally generated mock data. The model above becomes relevant once the
> adapter/server layer is built.
