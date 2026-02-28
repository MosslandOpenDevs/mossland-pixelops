# Architecture Overview

## System Diagram

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
│       │ WebSocket                                       │
└───────┼─────────────────────────────────────────────────┘
        │
┌───────┼─────────────────────────────────────────────────┐
│       │           Server (Fastify)                      │
│  ┌────┴──────────────────────────────────────────────┐  │
│  │              Event Normalizer                     │  │
│  │         PixelOpsEvent validation (Zod)            │  │
│  └────▲─────────▲─────────▲─────────▲────────────────┘  │
│       │         │         │         │                   │
│  ┌────┴───┐ ┌───┴───┐ ┌───┴───┐ ┌───┴────┐             │
│  │ GitHub │ │  AO   │ │Algora │ │Bridge  │             │
│  │Adapter │ │Adapter│ │Adapter│ │Adapter │             │
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

## Core Data Flow

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

**Key invariant:** The world state is a pure projection of the event log.
Given the same event sequence, the world state is identical (deterministic replay).

## Package Responsibilities

### `packages/events`
- `PixelOpsEvent` type definition and Zod schema
- Event type registry (enum of all known event types)
- Serialization/deserialization utilities

### `packages/world-model`
- Entity types: `Agent`, `Building`, `Pipeline`, `Proposal`, `Signal`, `Artifact`
- World state type: map of entity ID → entity
- Reducer: `(WorldState, PixelOpsEvent) → WorldState`
- Entity-to-event mapping rules

### `packages/adapters`
- `IAdapter` interface: `start()`, `stop()`, `onEvent(callback)`
- Per-source adapter implementations
- Rate limiting and caching utilities
- Health check contract

### `apps/client`
- Phaser game scene management
- React UI shell (panels, filters, timeline)
- WebSocket connection to server
- Local event buffer for replay
- Zustand store bridging world state to React + Phaser

### `apps/server`
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

### Why Fastify (not Express)?
- Schema-based validation (aligns with Zod schemas)
- First-class WebSocket support via plugins
- Better performance characteristics

### Why append-only event store?
- Deterministic replay requires immutable event history
- Enables time-travel debugging
- Natural audit trail for governance transparency

## Security Model

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
