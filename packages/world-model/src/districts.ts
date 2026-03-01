export interface District {
  id: string;
  name: string;
  description: string;
  color: number;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
}

/**
 * Indoor office layout: 40×28 tile grid.
 * 4 rooms in a 2×2 layout connected by corridors.
 *
 * Layout:
 *   Col 0:  left wall
 *   Col 1-18:  left rooms (interior)
 *   Col 19-20: vertical corridor
 *   Col 21-38: right rooms (interior)
 *   Col 39: right wall
 *
 *   Row 0:  top wall
 *   Row 1-12: top rooms (interior)
 *   Row 13-14: horizontal corridor
 *   Row 15-26: bottom rooms (interior)
 *   Row 27: bottom wall
 */
export const DISTRICTS: District[] = [
  {
    id: 'dev-hub',
    name: 'Dev Hub',
    description: 'GitHub activity & development operations',
    color: 0x4a90d9,
    tileX: 1,
    tileY: 1,
    width: 18,
    height: 12,
  },
  {
    id: 'ao-quarter',
    name: 'AO Quarter',
    description: 'Agentic Orchestrator pipelines & agents',
    color: 0xd94a4a,
    tileX: 21,
    tileY: 1,
    width: 18,
    height: 12,
  },
  {
    id: 'governance-plaza',
    name: 'Governance Plaza',
    description: 'Algora proposals & deliberation',
    color: 0x4ad97a,
    tileX: 1,
    tileY: 15,
    width: 18,
    height: 12,
  },
  {
    id: 'bridge-district',
    name: 'Bridge District',
    description: 'Cross-ecosystem signals & milestones',
    color: 0xd9a84a,
    tileX: 21,
    tileY: 15,
    width: 18,
    height: 12,
  },
];

export function getDistrictById(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}
