export type EventSource = 'github' | 'ao' | 'algora' | 'bridge' | 'system' | 'mock';

export type EventType =
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

export type EntityKind =
  | 'agent'
  | 'building'
  | 'pipeline'
  | 'proposal'
  | 'signal'
  | 'artifact';

export interface EntityRef {
  kind: EntityKind;
  id: string;
  name: string;
}

export interface Provenance {
  url: string;
  label: string;
  hash?: string;
}

export interface PixelOpsEvent {
  id: string;
  ts: string;
  source: EventSource;
  type: EventType;
  entity: EntityRef;
  payload: Record<string, unknown>;
  provenance: Provenance;
}
