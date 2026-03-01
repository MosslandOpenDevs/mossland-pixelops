export type AgentState = 'idle' | 'walking' | 'working';

export interface AgentEntity {
  id: string;
  name: string;
  districtId: string;
  state: AgentState;
  spriteKey: string;
  tileX: number;
  tileY: number;
  lastEventId?: string;
  lastEventType?: string;
  eventHistory: string[];
}

export type BuildingState = 'idle' | 'active' | 'alert';

export interface BuildingEntity {
  id: string;
  name: string;
  districtId: string;
  state: BuildingState;
  spriteKey: string;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  lastEventId?: string;
  eventHistory: string[];
}

export interface WorldState {
  agents: Record<string, AgentEntity>;
  buildings: Record<string, BuildingEntity>;
  eventLog: EventLogEntry[];
  tick: number;
}

export interface EventLogEntry {
  eventId: string;
  ts: string;
  type: string;
  source: string;
  entityId: string;
  entityName: string;
  summary: string;
}
