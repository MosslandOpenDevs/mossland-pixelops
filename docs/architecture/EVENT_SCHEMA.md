# Event Schema Specification

## PixelOpsEvent

The common event schema used across all adapters.

```typescript
interface PixelOpsEvent {
  /** Unique event ID (UUID v7 for time-sortability) */
  id: string;

  /** ISO 8601 timestamp of when the event occurred at the source */
  ts: string;

  /** Adapter source identifier */
  source: EventSource;

  /** Event type (determines payload shape) */
  type: EventType;

  /** Primary entity affected by this event */
  entity: EntityRef;

  /** Type-specific payload */
  payload: Record<string, unknown>;

  /** Provenance: link back to the source artifact */
  provenance: Provenance;
}
```

## Supporting Types

```typescript
type EventSource = 'github' | 'ao' | 'algora' | 'bridge' | 'system';

type EventType =
  // GitHub
  | 'commit.pushed'
  | 'pr.opened'
  | 'pr.merged'
  | 'pr.closed'
  | 'issue.opened'
  | 'issue.closed'
  | 'issue.commented'
  // Agentic Orchestrator
  | 'agent.spawned'
  | 'agent.state_changed'
  | 'pipeline.stage_entered'
  | 'pipeline.completed'
  | 'debate.started'
  | 'debate.concluded'
  // Algora
  | 'proposal.created'
  | 'proposal.voted'
  | 'proposal.decided'
  | 'deliberation.started'
  | 'deliberation.concluded'
  // Bridge
  | 'signal.detected'
  | 'milestone.reached'
  | 'proof.submitted'
  // System
  | 'adapter.connected'
  | 'adapter.disconnected'
  | 'adapter.error';

interface EntityRef {
  /** Entity type */
  kind: 'agent' | 'building' | 'pipeline' | 'proposal' | 'signal' | 'artifact';
  /** Unique entity ID within its kind */
  id: string;
  /** Human-readable name */
  name: string;
}

interface Provenance {
  /** URL to the source artifact (GitHub PR, AO dashboard, etc.) */
  url: string;
  /** Human-readable label for the link */
  label: string;
  /** Optional: raw API response hash for integrity verification */
  hash?: string;
}
```

## Event Examples

### GitHub commit

```json
{
  "id": "019462a0-1234-7000-8000-000000000001",
  "ts": "2026-03-15T10:30:00Z",
  "source": "github",
  "type": "commit.pushed",
  "entity": {
    "kind": "artifact",
    "id": "commit-abc1234",
    "name": "Fix adapter reconnection logic"
  },
  "payload": {
    "repo": "MosslandOpenDevs/mossland-pixelops",
    "sha": "abc1234def5678",
    "author": "dev-alice",
    "files_changed": 3
  },
  "provenance": {
    "url": "https://github.com/MosslandOpenDevs/mossland-pixelops/commit/abc1234",
    "label": "GitHub commit abc1234"
  }
}
```

### AO agent state change

```json
{
  "id": "019462a0-1234-7000-8000-000000000002",
  "ts": "2026-03-15T10:31:00Z",
  "source": "ao",
  "type": "agent.state_changed",
  "entity": {
    "kind": "agent",
    "id": "ao-agent-07",
    "name": "Research Analyst #7"
  },
  "payload": {
    "previous_state": "idle",
    "new_state": "debating",
    "pipeline_id": "pipeline-42",
    "phase": "phase-2-debate"
  },
  "provenance": {
    "url": "https://ao-dashboard.mossland.dev/agents/07",
    "label": "AO Dashboard — Agent #7"
  }
}
```

## Validation Rules

1. `id` must be a valid UUID v7.
2. `ts` must be a valid ISO 8601 timestamp.
3. `source` must be a known `EventSource` value.
4. `type` must be a known `EventType` value.
5. `entity.kind` must match one of the defined entity kinds.
6. `provenance.url` must be a valid URL.
7. Events with unknown types are logged but not processed (forward compatibility).

## Versioning

The schema version is tracked in `packages/events/package.json`.
Breaking changes increment the major version and require adapter updates.
