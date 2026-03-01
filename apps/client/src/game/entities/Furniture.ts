import Phaser from 'phaser';
import { TILE_SIZE } from '../constants';

export function generateFurnitureTextures(_scene: Phaser.Scene): void {}

interface FP { key: string; tw: number; th: number; tx: number; ty: number; }

/**
 * Place furniture using pixel-agents hand-drawn sprites (pa-*).
 * Layout inspired by pixel-agents default office design.
 */
export function placeFurniturePA(
  scene: Phaser.Scene,
  _districtId: string,
  dx: number, dy: number,
  dw: number, dh: number,
  grid: boolean[][],
): Phaser.GameObjects.Image[] {
  const p: FP[] = [];

  // ── Desks (pa-desk = 32×32 = 2×2 tiles) ──
  put(p, 'pa-desk', dx + 2, dy + 1, 2, 2, grid);
  put(p, 'pa-desk', dx + 8, dy + 1, 2, 2, grid);
  put(p, 'pa-desk', dx + 5, dy + dh - 5, 2, 2, grid);
  put(p, 'pa-desk', dx + 11, dy + dh - 5, 2, 2, grid);

  // ── Chairs (pa-chair = 16×16 = 1×1) — in front of desks ──
  put(p, 'pa-chair', dx + 2, dy + 3, 1, 1, grid);
  put(p, 'pa-chair', dx + 3, dy + 3, 1, 1, grid);
  put(p, 'pa-chair', dx + 8, dy + 3, 1, 1, grid);
  put(p, 'pa-chair', dx + 9, dy + 3, 1, 1, grid);
  put(p, 'pa-chair', dx + 5, dy + dh - 6, 1, 1, grid);
  put(p, 'pa-chair', dx + 6, dy + dh - 6, 1, 1, grid);
  put(p, 'pa-chair', dx + 11, dy + dh - 6, 1, 1, grid);
  put(p, 'pa-chair', dx + 12, dy + dh - 6, 1, 1, grid);

  // ── PC monitors (pa-pc = 16×16) — on desks ──
  put(p, 'pa-pc', dx + 4, dy + 1, 1, 1, grid);
  put(p, 'pa-pc', dx + 10, dy + 1, 1, 1, grid);
  put(p, 'pa-pc', dx + 7, dy + dh - 5, 1, 1, grid);
  put(p, 'pa-pc', dx + 13, dy + dh - 5, 1, 1, grid);

  // ── Bookshelves (pa-bookshelf = 16×32 = 1×2) — along walls ──
  put(p, 'pa-bookshelf', dx + dw - 1, dy + 1, 1, 2, grid);
  put(p, 'pa-bookshelf', dx + dw - 1, dy + 4, 1, 2, grid);

  // ── Whiteboard (pa-whiteboard = 32×16 = 2×1) — on wall ──
  put(p, 'pa-whiteboard', dx + 5, dy + 0, 2, 1, grid);

  // ── Plants (pa-plant = 16×24 ≈ 1×1.5) — corners ──
  put(p, 'pa-plant', dx + 0, dy + 0, 1, 1, grid);
  put(p, 'pa-plant', dx + dw - 1, dy + dh - 2, 1, 1, grid);

  // ── Water cooler (pa-cooler = 16×24 ≈ 1×1.5) ──
  put(p, 'pa-cooler', dx + dw - 1, dy + 7, 1, 1, grid);

  // ── Lamp (pa-lamp = 16×16 = 1×1) ──
  put(p, 'pa-lamp', dx + 14, dy + 5, 1, 1, grid);

  // ── Sofa (pa-sofa = 32×16 = 2×1) ──
  put(p, 'pa-sofa', dx + 0, dy + dh - 2, 2, 1, grid);

  // ── Trash can (pa-trashcan = 16×16 = 1×1) ──
  put(p, 'pa-trashcan', dx + dw - 2, dy + dh - 1, 1, 1, grid);

  // ── Painting (pa-painting = 16×16 = 1×1) — on wall ──
  put(p, 'pa-painting', dx + 7, dy + 0, 1, 1, grid);

  // ── Render all ──
  const images: Phaser.GameObjects.Image[] = [];
  for (const f of p) {
    const img = scene.add.image(f.tx * TILE_SIZE, f.ty * TILE_SIZE, f.key);
    img.setOrigin(0, 0);
    img.setDepth(f.ty * TILE_SIZE + img.height);
    images.push(img);
    for (let tdy = 0; tdy < f.th; tdy++)
      for (let tdx = 0; tdx < f.tw; tdx++)
        if (grid[f.ty + tdy]?.[f.tx + tdx] !== undefined) grid[f.ty + tdy]![f.tx + tdx] = false;
  }
  return images;
}

// Also export as placeFurnitureFromTileset for compatibility
export const placeFurnitureFromTileset = placeFurniturePA;

function put(p: FP[], key: string, tx: number, ty: number, tw: number, th: number, grid: boolean[][]): boolean {
  for (let dy = 0; dy < th; dy++)
    for (let dx = 0; dx < tw; dx++)
      if (!grid[ty + dy]?.[tx + dx]) return false;
  p.push({ key, tw, th, tx, ty });
  return true;
}
