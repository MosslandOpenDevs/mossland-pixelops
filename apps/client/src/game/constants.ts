// Generative Agents map uses 32px tiles (140×100)
export const TILE_SIZE = 32;
export const MAP_WIDTH = 140;
export const MAP_HEIGHT = 100;
export const WORLD_WIDTH = MAP_WIDTH * TILE_SIZE;   // 4480px
export const WORLD_HEIGHT = MAP_HEIGHT * TILE_SIZE;  // 3200px

export const CAMERA_ZOOM_MIN = 1;
export const CAMERA_ZOOM_MAX = 6;
export const CAMERA_ZOOM_STEP = 0.25;
export const CAMERA_SCROLL_SPEED = 8;

export const AGENT_SPEED = 3; // tiles per second (faster for indoor)
export const WANDER_MIN_DELAY = 2000; // ms
export const WANDER_MAX_DELAY = 8000; // ms
export const WORK_DURATION = 4000; // ms

// Sprite frame dimensions (MetroCity-style: 16 wide, 32 tall)
export const CHAR_FRAME_W = 16;
export const CHAR_FRAME_H = 32;

// Character sitting offset when working at desk
export const CHARACTER_SITTING_OFFSET = 6;

// Work animation sub-states
export const WORK_ANIMS = ['typing', 'reading'] as const;
export type WorkAnim = (typeof WORK_ANIMS)[number];

// Name label visibility zoom threshold
export const LABEL_ZOOM_THRESHOLD = 2.0;

// Particle texture keys
export const PARTICLE_KEYS = [
  'particle-green',
  'particle-blue',
  'particle-red',
  'particle-yellow',
  'particle-orange',
  'particle-white',
] as const;
export const PARTICLE_SIZE = 4;

// Room floor colors (HSL-ish for pixel-agents style)
export const ROOM_FLOOR_COLORS: Record<string, number> = {
  'dev-hub': 0x3d3528,        // warm beige
  'ao-quarter': 0x282d3d,     // cool blue-gray
  'governance-plaza': 0x283d2d, // warm green
  'bridge-district': 0x3d3328, // warm amber
};

// Wall color (pixel-agents: #3A3A5C)
export const WALL_COLOR = 0x3a3a5c;
export const WALL_TOP_COLOR = 0x4a4a6c;

// Corridor floor color (pixel-agents fallback: #808080)
export const CORRIDOR_FLOOR_COLOR = 0x808080;

// Colors for districts (UI highlights)
export const DISTRICT_COLORS: Record<string, number> = {
  'dev-hub': 0x4a90d9,
  'ao-quarter': 0xd94a4a,
  'governance-plaza': 0x4ad97a,
  'bridge-district': 0xd9a84a,
};
