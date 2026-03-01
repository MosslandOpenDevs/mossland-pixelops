import Phaser from 'phaser';
import { TILE_SIZE } from '../constants';

function createDecoTexture(scene: Phaser.Scene, key: string, w: number, h: number, drawFn: (ctx: CanvasRenderingContext2D) => void) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex!.getContext();
  ctx.clearRect(0, 0, w, h);
  drawFn(ctx);
  tex!.refresh();
}

export function generateDecorationTextures(scene: Phaser.Scene): void {
  createDecoTexture(scene, 'deco-large-plant', 16, 16, (ctx) => {
    ctx.fillStyle = '#8B4422';
    ctx.fillRect(4, 10, 8, 5);
    ctx.fillStyle = '#B85C3A';
    ctx.fillRect(5, 11, 6, 3);
    ctx.fillStyle = '#2D8B2D';
    ctx.fillRect(3, 3, 10, 7);
    ctx.fillRect(2, 5, 12, 4);
    ctx.fillStyle = '#3A9D3A';
    ctx.fillRect(5, 3, 4, 3);
    ctx.fillRect(8, 5, 3, 2);
  });
}

export function placeDecorations(
  scene: Phaser.Scene,
  walkableGrid: boolean[][],
): Phaser.GameObjects.Image[] {
  const images: Phaser.GameObjects.Image[] = [];
  const positions = [
    { key: 'deco-large-plant', tx: 19, ty: 13 },
    { key: 'deco-large-plant', tx: 20, ty: 14 },
  ];

  for (const pos of positions) {
    if (walkableGrid[pos.ty]?.[pos.tx]) {
      const img = scene.add.image(pos.tx * TILE_SIZE, pos.ty * TILE_SIZE, pos.key);
      img.setOrigin(0, 0);
      img.setDepth(pos.ty * TILE_SIZE + TILE_SIZE);
      images.push(img);
      walkableGrid[pos.ty]![pos.tx] = false;
    }
  }
  return images;
}
