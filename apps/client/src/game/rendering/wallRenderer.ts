import Phaser from 'phaser';
import { TILE_SIZE } from '../constants';
import { TILES } from '../maps/worldMapData';

/**
 * Wall auto-tiler using walls.png spritesheet.
 * walls.png: 64×128 = 4 cols × 4 rows of 16×32 pieces.
 * Bitmask: N=1, E=2, S=4, W=8
 */
export function renderAutoWalls(
  scene: Phaser.Scene,
  wallData: number[],
  mapWidth: number,
  mapHeight: number,
): Phaser.GameObjects.Image[] {
  if (!scene.textures.exists('walls')) return [];

  const images: Phaser.GameObjects.Image[] = [];
  const isWall = (i: number) => wallData[i] === TILES.WALL;

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const idx = y * mapWidth + x;
      if (!isWall(idx)) continue;

      let mask = 0;
      if (y > 0 && isWall((y - 1) * mapWidth + x)) mask |= 1;
      if (x < mapWidth - 1 && isWall(y * mapWidth + x + 1)) mask |= 2;
      if (y < mapHeight - 1 && isWall((y + 1) * mapWidth + x)) mask |= 4;
      if (x > 0 && isWall(y * mapWidth + x - 1)) mask |= 8;

      const img = scene.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE,
        'walls',
        mask,
      );
      img.setOrigin(0.5, 1);
      img.setDepth((y + 1) * TILE_SIZE);
      images.push(img);
    }
  }

  return images;
}
