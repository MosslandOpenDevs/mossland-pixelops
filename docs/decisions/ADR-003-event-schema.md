# ADR-003: Event Schema Design

## Status
Proposed

## Context
PixelOps ingests data from multiple heterogeneous sources (GitHub, Agentic Orchestrator, Algora, Bridge-2026). Each source has its own data model and API format. We need a common event schema that:

1. Normalizes all sources into a single format
2. Preserves provenance (link back to the original source)
3. Supports deterministic replay (events fully describe state transitions)
4. Is extensible for future data sources

## Decision
Define a `PixelOpsEvent` schema with these required fields:
- `id` — UUID v7 (time-sortable)
- `ts` — Source timestamp (ISO 8601)
- `source` — Adapter identifier
- `type` — Typed event category
- `entity` — Reference to the affected entity (kind + id + name)
- `payload` — Type-specific data (flexible Record)
- `provenance` — Source URL + label + optional integrity hash

Validation is enforced via Zod schemas in `packages/events`.

## Rationale
- **UUID v7** provides time-sortability without relying on insertion order.
- **Typed `source` + `type`** enables efficient filtering and routing.
- **`EntityRef`** creates a stable link between events and world model entities.
- **`Provenance`** is a first-class field (not metadata) because "show me the proof" is a core UX principle.
- **Flexible `payload`** avoids over-constraining adapters while the schema matures.

## Consequences
- Adapters must map their native data to `PixelOpsEvent` format.
- Unknown event types are logged but not rendered (forward compatibility).
- Schema versioning follows semver in `packages/events/package.json`.
- Breaking schema changes require coordinated adapter updates.

## References
- [Event schema specification](../architecture/EVENT_SCHEMA.md)
- [CloudEvents specification](https://cloudevents.io/) (inspiration, not adopted)
