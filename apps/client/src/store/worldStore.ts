import { create } from 'zustand';
import type { PixelOpsEvent } from '@pixelops/events';
import type { WorldState, AgentEntity, BuildingEntity, EventLogEntry } from '@pixelops/world-model';
import { reduceEvent } from '@pixelops/world-model';

interface SelectedEntity {
  type: 'agent' | 'building';
  id: string;
  name: string;
  districtId: string;
  state: string;
  tileX: number;
  tileY: number;
}

interface MockConfig {
  speed: number; // events per second
  paused: boolean;
}

interface WorldStore extends WorldState {
  selectedEntity: SelectedEntity | null;
  mockConfig: MockConfig;
  fps: number;

  // Actions
  processEvent: (event: PixelOpsEvent) => void;
  initAgents: (agents: Record<string, AgentEntity>) => void;
  initBuildings: (buildings: Record<string, BuildingEntity>) => void;
  selectEntity: (entity: SelectedEntity | null) => void;
  setMockSpeed: (speed: number) => void;
  setMockPaused: (paused: boolean) => void;
  setFps: (fps: number) => void;
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  agents: {},
  buildings: {},
  eventLog: [],
  tick: 0,
  selectedEntity: null,
  mockConfig: { speed: 2, paused: false },
  fps: 0,

  processEvent: (event) => {
    const state = get();
    const newState = reduceEvent(
      { agents: state.agents, buildings: state.buildings, eventLog: state.eventLog, tick: state.tick },
      event,
    );
    set(newState);
  },

  initAgents: (agents) => set({ agents }),
  initBuildings: (buildings) => set({ buildings }),
  selectEntity: (entity) => set({ selectedEntity: entity }),
  setMockSpeed: (speed) => set((s) => ({ mockConfig: { ...s.mockConfig, speed } })),
  setMockPaused: (paused) => set((s) => ({ mockConfig: { ...s.mockConfig, paused } })),
  setFps: (fps) => set({ fps }),
}));
