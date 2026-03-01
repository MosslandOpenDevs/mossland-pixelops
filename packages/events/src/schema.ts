import { z } from 'zod';

export const EntityRefSchema = z.object({
  kind: z.enum(['agent', 'building', 'pipeline', 'proposal', 'signal', 'artifact']),
  id: z.string().min(1),
  name: z.string().min(1),
});

export const ProvenanceSchema = z.object({
  url: z.string().url(),
  label: z.string().min(1),
  hash: z.string().optional(),
});

export const EventSourceSchema = z.enum([
  'github', 'ao', 'algora', 'bridge', 'system', 'mock',
]);

export const EventTypeSchema = z.enum([
  'commit.pushed', 'pr.opened', 'pr.merged', 'pr.closed',
  'issue.opened', 'issue.closed', 'issue.commented',
  'agent.spawned', 'agent.state_changed',
  'pipeline.stage_entered', 'pipeline.completed',
  'debate.started', 'debate.concluded',
  'proposal.created', 'proposal.voted', 'proposal.decided',
  'deliberation.started', 'deliberation.concluded',
  'signal.detected', 'milestone.reached', 'proof.submitted',
  'adapter.connected', 'adapter.disconnected', 'adapter.error',
]);

export const PixelOpsEventSchema = z.object({
  id: z.string().uuid(),
  ts: z.string().datetime(),
  source: EventSourceSchema,
  type: EventTypeSchema,
  entity: EntityRefSchema,
  payload: z.record(z.unknown()),
  provenance: ProvenanceSchema,
});
