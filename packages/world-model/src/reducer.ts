import type { PixelOpsEvent } from '@pixelops/events';
import type { WorldState, EventLogEntry } from './entities.js';

const MAX_EVENT_LOG = 200;
const MAX_ENTITY_HISTORY = 20;

export function reduceEvent(state: WorldState, event: PixelOpsEvent): WorldState {
  const logEntry: EventLogEntry = {
    eventId: event.id,
    ts: event.ts,
    type: event.type,
    source: event.source,
    entityId: event.entity.id,
    entityName: event.entity.name,
    summary: formatEventSummary(event),
  };

  const eventLog = [logEntry, ...state.eventLog].slice(0, MAX_EVENT_LOG);
  let agents = state.agents;
  let buildings = state.buildings;

  // Agent-related events
  if (event.entity.kind === 'agent') {
    const agentId = event.entity.id;
    const existing = agents[agentId];
    if (existing) {
      const newState = resolveAgentState(event.type);
      agents = {
        ...agents,
        [agentId]: {
          ...existing,
          state: newState ?? existing.state,
          lastEventId: event.id,
          lastEventType: event.type,
          eventHistory: [event.id, ...existing.eventHistory].slice(0, MAX_ENTITY_HISTORY),
        },
      };
    }
  }

  // Building-related events
  if (event.entity.kind === 'building') {
    const buildingId = event.entity.id;
    const existing = buildings[buildingId];
    if (existing) {
      const newState = resolveBuildingState(event.type);
      buildings = {
        ...buildings,
        [buildingId]: {
          ...existing,
          state: newState ?? existing.state,
          lastEventId: event.id,
          eventHistory: [event.id, ...existing.eventHistory].slice(0, MAX_ENTITY_HISTORY),
        },
      };
    }
  }

  // For non-entity-specific events, activate a random related agent
  if (event.entity.kind === 'artifact' || event.entity.kind === 'pipeline') {
    const districtId = sourceToDistrict(event.source);
    const districtAgents = Object.values(agents).filter((a) => a.districtId === districtId);
    if (districtAgents.length > 0) {
      const target = districtAgents[Math.floor(Math.random() * districtAgents.length)]!;
      agents = {
        ...agents,
        [target.id]: {
          ...target,
          state: 'working',
          lastEventId: event.id,
          lastEventType: event.type,
          eventHistory: [event.id, ...target.eventHistory].slice(0, MAX_ENTITY_HISTORY),
        },
      };
    }
  }

  return {
    agents,
    buildings,
    eventLog,
    tick: state.tick + 1,
  };
}

function resolveAgentState(eventType: string): 'idle' | 'walking' | 'working' | null {
  if (eventType.includes('spawned')) return 'idle';
  if (eventType.includes('state_changed')) return 'working';
  if (eventType.includes('completed') || eventType.includes('concluded')) return 'idle';
  if (eventType.includes('started') || eventType.includes('entered')) return 'working';
  return 'working';
}

function resolveBuildingState(eventType: string): 'idle' | 'active' | 'alert' | null {
  if (eventType.includes('error')) return 'alert';
  if (eventType.includes('completed') || eventType.includes('concluded')) return 'idle';
  if (eventType.includes('started') || eventType.includes('entered')) return 'active';
  return 'active';
}

function sourceToDistrict(source: string): string {
  switch (source) {
    case 'github': return 'dev-hub';
    case 'ao': return 'ao-quarter';
    case 'algora': return 'governance-plaza';
    case 'bridge': return 'bridge-district';
    default: return 'dev-hub';
  }
}

function formatEventSummary(event: PixelOpsEvent): string {
  const typeLabel = event.type.replace('.', ' ').replace('_', ' ');
  return `[${event.source}] ${typeLabel}: ${event.entity.name}`;
}
