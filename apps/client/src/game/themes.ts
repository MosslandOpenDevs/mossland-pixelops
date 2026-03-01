/**
 * Theme configuration for 3 prototypes.
 *
 * Theme 1: pixel-agents (MetroCity chars + Office Interior Tileset + walls.png auto-tile)
 * Theme 2: modern (Modern Interiors chars + Modern Office + Room Builder Office)
 * Theme 3: combined (MetroCity chars + all tilesets merged)
 */

export type ThemeId = 'pixel-agents' | 'modern-office' | 'combined';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  /** Character spritesheet paths. Each is a horizontal strip of 16×32 frames. */
  characters: {
    type: 'metrocity' | 'modern-interiors';
    /** For metrocity: char_0.png..char_5.png (7 cols × 3 rows = 112×96) */
    /** For modern-interiors: Adam_run.png etc. (24 cols × 1 row = 384×32) */
    paths: string[];
  };
  /** Tileset image for furniture/props */
  furnitureTileset: string;
  /** Tileset image for room building (floors + walls), null = use programmatic */
  roomBuilderTileset: string | null;
  /** Additional tileset for extra furniture (null = none) */
  extraTileset: string | null;
  /** Floor tile indices from the roomBuilderTileset (or -1 for programmatic) */
  floorTiles: number[];
  /** Wall tile indices from the roomBuilderTileset */
  wallTiles: number[];
  /** Use walls.png auto-tile? */
  useAutoWalls: boolean;
  /** Background color */
  bgColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'pixel-agents': {
    id: 'pixel-agents',
    label: 'Pixel Agents (Office Interior)',
    characters: {
      type: 'metrocity',
      paths: Array.from({ length: 6 }, (_, i) => `assets/characters/char_${i}.png`),
    },
    furnitureTileset: 'assets/tilesets/office-tileset.png',
    roomBuilderTileset: null, // use programmatic floors
    extraTileset: null,
    floorTiles: [],
    wallTiles: [],
    useAutoWalls: true,
    bgColor: '#1e1e2e',
  },
  'modern-office': {
    id: 'modern-office',
    label: 'Modern Office (Revamped)',
    characters: {
      type: 'modern-interiors',
      paths: ['Adam', 'Bob', 'Alex', 'Amelia'].map(
        (n) => `assets/characters-modern/${n}_run.png`,
      ),
    },
    furnitureTileset: 'assets/tilesets/modern-office.png',
    roomBuilderTileset: 'assets/tilesets/room-builder-office.png',
    extraTileset: null,
    // Room Builder Office: 16 cols × 14 rows = 224 tiles
    // Floor patterns in middle rows, wall patterns in lower rows
    floorTiles: [33, 34, 49, 50], // row 2-3, warm tones
    wallTiles: [83, 84, 99, 100], // row 5-6, brick patterns
    useAutoWalls: false,
    bgColor: '#1a1a28',
  },
  'combined': {
    id: 'combined',
    label: 'Combined (All Assets)',
    characters: {
      type: 'metrocity',
      paths: Array.from({ length: 6 }, (_, i) => `assets/characters/char_${i}.png`),
    },
    furnitureTileset: 'assets/tilesets/modern-office.png',
    roomBuilderTileset: 'assets/tilesets/room-builder-office.png',
    extraTileset: 'assets/tilesets/office-tileset.png',
    floorTiles: [33, 34, 49, 50],
    wallTiles: [83, 84, 99, 100],
    useAutoWalls: true,
    bgColor: '#1e1e2e',
  },
};

/** Current active theme. Changed via UI before game starts. */
let currentTheme: ThemeId = 'pixel-agents';

export function setTheme(id: ThemeId) {
  currentTheme = id;
}

export function getTheme(): ThemeConfig {
  return THEMES[currentTheme];
}

export function getThemeId(): ThemeId {
  return currentTheme;
}
