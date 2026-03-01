import { DISTRICTS } from '@pixelops/world-model';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from '../constants';

/**
 * Tile types matching pixel-agents convention.
 * WALL=0, FLOOR=1-7, VOID=8
 */
export const TILES = {
  WALL: 0,
  FLOOR_1: 1,
  FLOOR_2: 2,
  FLOOR_3: 3,
  VOID: 8,
  DOOR: 9,
} as const;

export const COLLISION_TILES: Set<number> = new Set([TILES.WALL, TILES.VOID]);

export function generateGroundLayer(): number[] {
  const data = new Array<number>(MAP_WIDTH * MAP_HEIGHT).fill(TILES.VOID);

  // Fill district rooms with floor
  for (const district of DISTRICTS) {
    const floorType = district.id === 'ao-quarter' || district.id === 'bridge-district'
      ? TILES.FLOOR_2 : TILES.FLOOR_1;
    for (let y = district.tileY; y < district.tileY + district.height; y++) {
      for (let x = district.tileX; x < district.tileX + district.width; x++) {
        data[y * MAP_WIDTH + x] = floorType;
      }
    }
  }

  // Corridors
  for (let y = 13; y <= 14; y++)
    for (let x = 1; x < MAP_WIDTH - 1; x++)
      data[y * MAP_WIDTH + x] = TILES.FLOOR_3;
  for (let y = 1; y < MAP_HEIGHT - 1; y++)
    for (let x = 19; x <= 20; x++)
      data[y * MAP_WIDTH + x] = TILES.FLOOR_3;

  return data;
}

export function generateWallLayer(): number[] {
  const data = new Array<number>(MAP_WIDTH * MAP_HEIGHT).fill(TILES.VOID);

  // Outer walls
  for (let x = 0; x < MAP_WIDTH; x++) { data[x] = TILES.WALL; data[(MAP_HEIGHT - 1) * MAP_WIDTH + x] = TILES.WALL; }
  for (let y = 0; y < MAP_HEIGHT; y++) { data[y * MAP_WIDTH] = TILES.WALL; data[y * MAP_WIDTH + MAP_WIDTH - 1] = TILES.WALL; }

  // Internal walls
  for (let x = 1; x <= 18; x++) { data[12 * MAP_WIDTH + x] = TILES.WALL; data[15 * MAP_WIDTH + x] = TILES.WALL; }
  for (let x = 21; x <= 38; x++) { data[12 * MAP_WIDTH + x] = TILES.WALL; data[15 * MAP_WIDTH + x] = TILES.WALL; }
  for (let y = 1; y <= 12; y++) { data[y * MAP_WIDTH + 18] = TILES.WALL; data[y * MAP_WIDTH + 21] = TILES.WALL; }
  for (let y = 15; y <= 26; y++) { data[y * MAP_WIDTH + 18] = TILES.WALL; data[y * MAP_WIDTH + 21] = TILES.WALL; }

  // Doorways (clear walls for passage)
  for (let x = 8; x <= 10; x++) { data[12 * MAP_WIDTH + x] = TILES.DOOR; data[15 * MAP_WIDTH + x] = TILES.DOOR; }
  for (let x = 28; x <= 30; x++) { data[12 * MAP_WIDTH + x] = TILES.DOOR; data[15 * MAP_WIDTH + x] = TILES.DOOR; }
  for (let y = 5; y <= 7; y++) { data[y * MAP_WIDTH + 18] = TILES.DOOR; data[y * MAP_WIDTH + 21] = TILES.DOOR; }
  for (let y = 19; y <= 21; y++) { data[y * MAP_WIDTH + 18] = TILES.DOOR; data[y * MAP_WIDTH + 21] = TILES.DOOR; }

  return data;
}

/**
 * Create a simple tileset with solid colors — pixel-agents FALLBACK style.
 * Floor = #808080, Wall = #3A3A5C, Void = background color.
 */
export function createTilesetTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists('tileset')) scene.textures.remove('tileset');

  // 10 tiles to cover all tile type indices (0-9)
  const numTiles = 10;
  const canvas = document.createElement('canvas');
  canvas.width = numTiles * TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Tile 0: WALL — base color under walls.png auto-tile
  drawTile(ctx, 0, '#3A3A5C');

  // Tile 1: FLOOR_1 — warm beige (pixel-agents left room: h35 s30 b15)
  drawTile(ctx, 1, '#8A7B6A');

  // Tile 2: FLOOR_2 — cool gray (pixel-agents right room)
  drawTile(ctx, 2, '#808080');

  // Tile 3: FLOOR_3 — corridor
  drawTile(ctx, 3, '#757575');

  // Tiles 4-7: unused floor patterns
  for (let i = 4; i <= 7; i++) drawTile(ctx, i, '#808080');

  // Tile 8: VOID — dark background
  drawTile(ctx, 8, '#1e1e2e');

  // Tile 9: DOOR — slightly lighter floor for doorways
  drawTile(ctx, 9, '#8A8070');

  scene.textures.addCanvas('tileset', canvas);
}

function drawTile(ctx: CanvasRenderingContext2D, index: number, color: string) {
  const x = index * TILE_SIZE;
  ctx.fillStyle = color;
  ctx.fillRect(x, 0, TILE_SIZE, TILE_SIZE);

  // Add subtle grid line (pixel-agents style)
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(x, 0, TILE_SIZE, 1);
  ctx.fillRect(x, 0, 1, TILE_SIZE);
}

/** No longer needed — kept for compatibility */
export function getTileMapping() {
  return { floor: TILES.FLOOR_1, floorAlt: TILES.FLOOR_2, wall: TILES.WALL, corridor: TILES.FLOOR_3, door: TILES.DOOR };
}
