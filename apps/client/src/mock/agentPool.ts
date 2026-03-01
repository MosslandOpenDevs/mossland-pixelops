import type { AgentEntity, BuildingEntity } from '@pixelops/world-model';
import { DISTRICTS } from '@pixelops/world-model';

export interface AgentDef {
  id: string;
  name: string;
  districtId: string;
  spriteIndex: number;
}

export interface BuildingDef {
  id: string;
  name: string;
  districtId: string;
  relativeX: number;  // relative to district tileX
  relativeY: number;  // relative to district tileY
}

export const AGENT_POOL: AgentDef[] = [
  // Dev Hub agents (5)
  { id: 'agent-alice', name: 'Alice (Dev Lead)', districtId: 'dev-hub', spriteIndex: 0 },
  { id: 'agent-bob', name: 'Bob (Backend)', districtId: 'dev-hub', spriteIndex: 1 },
  { id: 'agent-carol', name: 'Carol (Frontend)', districtId: 'dev-hub', spriteIndex: 2 },
  { id: 'agent-dave', name: 'Dave (DevOps)', districtId: 'dev-hub', spriteIndex: 3 },
  { id: 'agent-eve', name: 'Eve (QA)', districtId: 'dev-hub', spriteIndex: 4 },

  // AO Quarter agents (5)
  { id: 'agent-ao-01', name: 'AO Agent #1', districtId: 'ao-quarter', spriteIndex: 5 },
  { id: 'agent-ao-02', name: 'AO Agent #2', districtId: 'ao-quarter', spriteIndex: 6 },
  { id: 'agent-ao-03', name: 'AO Agent #3', districtId: 'ao-quarter', spriteIndex: 7 },
  { id: 'agent-ao-04', name: 'AO Analyst #4', districtId: 'ao-quarter', spriteIndex: 8 },
  { id: 'agent-ao-05', name: 'AO Analyst #5', districtId: 'ao-quarter', spriteIndex: 9 },

  // Governance Plaza agents (5)
  { id: 'agent-gov-01', name: 'Gov Delegate #1', districtId: 'governance-plaza', spriteIndex: 10 },
  { id: 'agent-gov-02', name: 'Gov Delegate #2', districtId: 'governance-plaza', spriteIndex: 11 },
  { id: 'agent-gov-03', name: 'Gov Delegate #3', districtId: 'governance-plaza', spriteIndex: 12 },
  { id: 'agent-gov-04', name: 'Gov Moderator', districtId: 'governance-plaza', spriteIndex: 13 },
  { id: 'agent-gov-05', name: 'Gov Recorder', districtId: 'governance-plaza', spriteIndex: 14 },

  // Bridge District agents (5)
  { id: 'agent-bridge-01', name: 'Bridge Watcher #1', districtId: 'bridge-district', spriteIndex: 15 },
  { id: 'agent-bridge-02', name: 'Bridge Watcher #2', districtId: 'bridge-district', spriteIndex: 16 },
  { id: 'agent-bridge-03', name: 'Signal Analyst', districtId: 'bridge-district', spriteIndex: 17 },
  { id: 'agent-bridge-04', name: 'Proof Verifier', districtId: 'bridge-district', spriteIndex: 18 },
  { id: 'agent-bridge-05', name: 'Bridge Courier', districtId: 'bridge-district', spriteIndex: 19 },
];

/**
 * Buildings are now 2×1 desk workstations inside the indoor office rooms.
 * Positions relative to each district's tileX/tileY.
 * Each 18×12 room has 4 workstations.
 */
export const BUILDING_POOL: BuildingDef[] = [
  // Dev Hub workstations (inside 18×12 room)
  { id: 'bldg-dev-main', name: 'Dev HQ', districtId: 'dev-hub', relativeX: 2, relativeY: 2 },
  { id: 'bldg-dev-ci', name: 'CI/CD Station', districtId: 'dev-hub', relativeX: 10, relativeY: 2 },
  { id: 'bldg-dev-repo', name: 'Repo Archive', districtId: 'dev-hub', relativeX: 2, relativeY: 8 },
  { id: 'bldg-dev-review', name: 'Code Review', districtId: 'dev-hub', relativeX: 10, relativeY: 8 },

  // AO Quarter workstations
  { id: 'bldg-ao-hub', name: 'AO Command', districtId: 'ao-quarter', relativeX: 2, relativeY: 2 },
  { id: 'bldg-ao-pipeline', name: 'Pipeline Console', districtId: 'ao-quarter', relativeX: 10, relativeY: 2 },
  { id: 'bldg-ao-debate', name: 'Debate Terminal', districtId: 'ao-quarter', relativeX: 2, relativeY: 8 },
  { id: 'bldg-ao-lab', name: 'Research Lab', districtId: 'ao-quarter', relativeX: 10, relativeY: 8 },

  // Governance Plaza workstations
  { id: 'bldg-gov-hall', name: 'Town Hall Desk', districtId: 'governance-plaza', relativeX: 2, relativeY: 2 },
  { id: 'bldg-gov-forum', name: 'Forum Station', districtId: 'governance-plaza', relativeX: 10, relativeY: 2 },
  { id: 'bldg-gov-vote', name: 'Voting Terminal', districtId: 'governance-plaza', relativeX: 2, relativeY: 8 },
  { id: 'bldg-gov-archive', name: 'Decision Archive', districtId: 'governance-plaza', relativeX: 10, relativeY: 8 },

  // Bridge District workstations
  { id: 'bldg-bridge-tower', name: 'Signal Console', districtId: 'bridge-district', relativeX: 2, relativeY: 2 },
  { id: 'bldg-bridge-gate', name: 'Bridge Gate', districtId: 'bridge-district', relativeX: 10, relativeY: 2 },
  { id: 'bldg-bridge-proof', name: 'Proof Terminal', districtId: 'bridge-district', relativeX: 2, relativeY: 8 },
  { id: 'bldg-bridge-relay', name: 'Relay Station', districtId: 'bridge-district', relativeX: 10, relativeY: 8 },
];

/**
 * Create initial AgentEntity records for the store
 */
export function createInitialAgents(): Record<string, AgentEntity> {
  const agents: Record<string, AgentEntity> = {};
  for (const def of AGENT_POOL) {
    const district = DISTRICTS.find((d) => d.id === def.districtId);
    if (!district) continue;

    const spawnX = district.tileX + 2 + Math.floor(Math.random() * (district.width - 4));
    const spawnY = district.tileY + 2 + Math.floor(Math.random() * (district.height - 4));

    agents[def.id] = {
      id: def.id,
      name: def.name,
      districtId: def.districtId,
      state: 'idle',
      spriteKey: `agent-${def.spriteIndex}`,
      tileX: spawnX,
      tileY: spawnY,
      eventHistory: [],
    };
  }
  return agents;
}

/**
 * Create initial BuildingEntity records — now 2×1 desk workstations
 */
export function createInitialBuildings(): Record<string, BuildingEntity> {
  const buildings: Record<string, BuildingEntity> = {};
  for (const def of BUILDING_POOL) {
    const district = DISTRICTS.find((d) => d.id === def.districtId);
    if (!district) continue;

    buildings[def.id] = {
      id: def.id,
      name: def.name,
      districtId: def.districtId,
      state: 'idle',
      spriteKey: 'building-idle',
      tileX: district.tileX + def.relativeX,
      tileY: district.tileY + def.relativeY,
      width: 2,
      height: 1,
      eventHistory: [],
    };
  }
  return buildings;
}
