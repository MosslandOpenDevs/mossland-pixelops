import type { EventSource, EventType } from '@pixelops/events';

interface EventTemplate {
  source: EventSource;
  type: EventType;
  entityKind: 'agent' | 'building' | 'artifact' | 'pipeline' | 'proposal' | 'signal';
  districtId: string;
  nameTemplate: string;
  provenanceLabel: string;
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  // GitHub events
  {
    source: 'github',
    type: 'commit.pushed',
    entityKind: 'artifact',
    districtId: 'dev-hub',
    nameTemplate: 'Commit: {message}',
    provenanceLabel: 'GitHub commit',
  },
  {
    source: 'github',
    type: 'pr.opened',
    entityKind: 'artifact',
    districtId: 'dev-hub',
    nameTemplate: 'PR: {title}',
    provenanceLabel: 'GitHub pull request',
  },
  {
    source: 'github',
    type: 'pr.merged',
    entityKind: 'artifact',
    districtId: 'dev-hub',
    nameTemplate: 'PR merged: {title}',
    provenanceLabel: 'GitHub pull request',
  },
  {
    source: 'github',
    type: 'issue.opened',
    entityKind: 'artifact',
    districtId: 'dev-hub',
    nameTemplate: 'Issue: {title}',
    provenanceLabel: 'GitHub issue',
  },

  // AO events
  {
    source: 'ao',
    type: 'agent.state_changed',
    entityKind: 'agent',
    districtId: 'ao-quarter',
    nameTemplate: '{agent}',
    provenanceLabel: 'AO Dashboard',
  },
  {
    source: 'ao',
    type: 'pipeline.stage_entered',
    entityKind: 'pipeline',
    districtId: 'ao-quarter',
    nameTemplate: 'Pipeline: {stage}',
    provenanceLabel: 'AO Pipeline',
  },
  {
    source: 'ao',
    type: 'debate.started',
    entityKind: 'agent',
    districtId: 'ao-quarter',
    nameTemplate: 'Debate: {topic}',
    provenanceLabel: 'AO Debate',
  },

  // Governance events
  {
    source: 'algora',
    type: 'proposal.created',
    entityKind: 'proposal',
    districtId: 'governance-plaza',
    nameTemplate: 'Proposal: {title}',
    provenanceLabel: 'Algora Governance',
  },
  {
    source: 'algora',
    type: 'proposal.voted',
    entityKind: 'proposal',
    districtId: 'governance-plaza',
    nameTemplate: 'Vote on: {title}',
    provenanceLabel: 'Algora Governance',
  },
  {
    source: 'algora',
    type: 'deliberation.started',
    entityKind: 'agent',
    districtId: 'governance-plaza',
    nameTemplate: 'Deliberation: {topic}',
    provenanceLabel: 'Algora Deliberation',
  },

  // Bridge events
  {
    source: 'bridge',
    type: 'signal.detected',
    entityKind: 'signal',
    districtId: 'bridge-district',
    nameTemplate: 'Signal: {type}',
    provenanceLabel: 'Bridge Signal',
  },
  {
    source: 'bridge',
    type: 'milestone.reached',
    entityKind: 'signal',
    districtId: 'bridge-district',
    nameTemplate: 'Milestone: {name}',
    provenanceLabel: 'Bridge Milestone',
  },
  {
    source: 'bridge',
    type: 'proof.submitted',
    entityKind: 'artifact',
    districtId: 'bridge-district',
    nameTemplate: 'Proof: {hash}',
    provenanceLabel: 'Bridge Proof',
  },
];

const COMMIT_MESSAGES = [
  'Fix adapter reconnection logic',
  'Update event schema validation',
  'Add retry mechanism for AO queries',
  'Refactor bridge signal handling',
  'Improve tilemap rendering performance',
  'Add unit tests for reducer',
  'Update CI pipeline configuration',
];

const PR_TITLES = [
  'feat: Add governance voting module',
  'fix: Bridge signal timeout handling',
  'chore: Upgrade Phaser to latest',
  'docs: Update API documentation',
  'refactor: Simplify event processing',
];

const TOPICS = [
  'Treasury allocation Q2',
  'Protocol upgrade v2.1',
  'Community fund proposal',
  'Agent training parameters',
  'Cross-chain bridge fees',
  'Data pipeline optimization',
];

export function getRandomPayloadName(template: EventTemplate): string {
  const t = template.nameTemplate;
  if (t.includes('{message}')) return t.replace('{message}', pick(COMMIT_MESSAGES));
  if (t.includes('{title}')) return t.replace('{title}', pick(PR_TITLES));
  if (t.includes('{topic}')) return t.replace('{topic}', pick(TOPICS));
  if (t.includes('{agent}')) return t.replace('{agent}', `AO Agent #${Math.floor(Math.random() * 5) + 1}`);
  if (t.includes('{stage}')) return t.replace('{stage}', `Stage ${Math.floor(Math.random() * 4) + 1}`);
  if (t.includes('{type}')) return t.replace('{type}', pick(['price', 'volume', 'sentiment', 'governance']));
  if (t.includes('{name}')) return t.replace('{name}', pick(['Alpha', 'Beta', 'Gamma', 'Delta']));
  if (t.includes('{hash}')) return t.replace('{hash}', Math.random().toString(36).substring(2, 10));
  return t;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}
