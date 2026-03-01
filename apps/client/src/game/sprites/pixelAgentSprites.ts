/**
 * All furniture & prop sprites from pixel-agents spriteData.ts (exact pixel data).
 * Plus additional props in the same pixel-art style.
 */

type SpriteData = string[][];
const _ = '';

// ════════════════════════════════════════════════════════════
// FROM pixel-agents (exact copies)
// ════════════════════════════════════════════════════════════

/** Square desk: 32x32 (2×2 tiles) */
export const DESK_SPRITE: SpriteData = (() => {
  const W = '#8B6914', L = '#A07828', S = '#B8922E', D = '#6B4E0A';
  const rows: string[][] = [];
  rows.push(new Array(32).fill(_));
  rows.push([_, ...new Array(30).fill(W), _]);
  for (let r = 0; r < 4; r++) rows.push([_, W, ...new Array(28).fill(r < 1 ? L : S), W, _]);
  rows.push([_, D, ...new Array(28).fill(W), D, _]);
  for (let r = 0; r < 6; r++) rows.push([_, W, ...new Array(28).fill(S), W, _]);
  rows.push([_, W, ...new Array(28).fill(L), W, _]);
  for (let r = 0; r < 6; r++) rows.push([_, W, ...new Array(28).fill(S), W, _]);
  rows.push([_, D, ...new Array(28).fill(W), D, _]);
  for (let r = 0; r < 4; r++) rows.push([_, W, ...new Array(28).fill(r > 2 ? L : S), W, _]);
  rows.push([_, ...new Array(30).fill(W), _]);
  for (let r = 0; r < 4; r++) {
    const row = new Array(32).fill(_) as string[];
    row[1] = D; row[2] = D; row[29] = D; row[30] = D;
    rows.push(row);
  }
  rows.push(new Array(32).fill(_));
  rows.push(new Array(32).fill(_));
  return rows;
})();

/** Plant in pot: 16x24 (1×1.5 tiles) */
export const PLANT_SPRITE: SpriteData = [
  [_, _, _, _, _, _, '#3D8B37', '#3D8B37', _, _, _, _, _, _, _, _],
  [_, _, _, _, _, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _, _, _, _],
  [_, _, _, _, '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _, _, _],
  [_, _, _, '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', _, _, _, _, _],
  [_, _, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _],
  [_, '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', _, _, _],
  [_, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _],
  [_, _, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _],
  [_, _, _, '#3D8B37', '#3D8B37', '#3D8B37', '#2D6B27', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _, _],
  [_, _, _, _, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _, _, _],
  [_, _, _, _, _, '#3D8B37', '#3D8B37', '#3D8B37', '#3D8B37', _, _, _, _, _, _, _],
  [_, _, _, _, _, _, '#6B4E0A', '#6B4E0A', _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, '#6B4E0A', '#6B4E0A', _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, '#6B4E0A', '#6B4E0A', _, _, _, _, _, _, _, _],
  [_, _, _, _, _, '#8B4422', '#8B4422', '#8B4422', '#8B4422', '#8B4422', _, _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _],
  [_, _, _, _, _, '#8B4422', '#B85C3A', '#B85C3A', '#B85C3A', '#8B4422', _, _, _, _, _, _],
  [_, _, _, _, _, _, '#8B4422', '#8B4422', '#8B4422', _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

/** Bookshelf: 16x32 (1×2 tiles) */
export const BOOKSHELF_SPRITE: SpriteData = (() => {
  const W = '#8B6914', D = '#6B4E0A';
  const R = '#CC4444', B = '#4477AA', G = '#44AA66', Y = '#CCAA33', P = '#9955AA';
  return [
    [_, W, W, W, W, W, W, W, W, W, W, W, W, W, W, _],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, R, R, B, B, G, G, Y, Y, R, R, B, B, D, W],
    [W, D, R, R, B, B, G, G, Y, Y, R, R, B, B, D, W],
    [W, D, R, R, B, B, G, G, Y, Y, R, R, B, B, D, W],
    [W, D, R, R, B, B, G, G, Y, Y, R, R, B, B, D, W],
    [W, D, R, R, B, B, G, G, Y, Y, R, R, B, B, D, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, D, P, P, Y, Y, B, B, G, G, P, P, R, R, D, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, D, G, G, R, R, P, P, B, B, Y, Y, G, G, D, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, D, D, D, D, D, D, D, D, D, D, D, D, D, D, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [_, W, W, W, W, W, W, W, W, W, W, W, W, W, W, _],
  ];
})();

/** Water cooler: 16x24 (1×1.5 tiles) */
export const COOLER_SPRITE: SpriteData = (() => {
  const W = '#CCDDEE', L = '#88BBDD', D = '#999999', B = '#666666';
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, D, L, L, L, L, L, L, D, _, _, _, _],
    [_, _, _, _, D, L, L, L, L, L, L, D, _, _, _, _],
    [_, _, _, _, D, L, L, L, L, L, L, D, _, _, _, _],
    [_, _, _, _, D, L, L, L, L, L, L, D, _, _, _, _],
    [_, _, _, _, D, L, L, L, L, L, L, D, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, _, D, W, W, W, W, D, _, _, _, _, _],
    [_, _, _, _, _, D, W, W, W, W, D, _, _, _, _, _],
    [_, _, _, _, _, D, W, W, W, W, D, _, _, _, _, _],
    [_, _, _, _, _, D, W, W, W, W, D, _, _, _, _, _],
    [_, _, _, _, _, D, W, W, W, W, D, _, _, _, _, _],
    [_, _, _, _, D, D, W, W, W, W, D, D, _, _, _, _],
    [_, _, _, _, D, W, W, W, W, W, W, D, _, _, _, _],
    [_, _, _, _, D, W, W, W, W, W, W, D, _, _, _, _],
    [_, _, _, _, D, D, D, D, D, D, D, D, _, _, _, _],
    [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _],
    [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _],
    [_, _, _, _, _, D, B, B, B, B, D, _, _, _, _, _],
    [_, _, _, _, D, D, B, B, B, B, D, D, _, _, _, _],
    [_, _, _, _, D, B, B, B, B, B, B, D, _, _, _, _],
    [_, _, _, _, D, D, D, D, D, D, D, D, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

/** Whiteboard: 32x16 (2×1 tiles) */
export const WHITEBOARD_SPRITE: SpriteData = (() => {
  const F = '#AAAAAA', W = '#EEEEFF', M = '#CC4444', B = '#4477AA';
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, _],
    [_, F, W, W, M, M, M, W, W, W, W, W, B, B, B, B, W, W, W, W, W, W, W, M, W, W, W, W, W, W, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, B, B, W, W, M, W, W, W, W, W, W, F, _],
    [_, F, W, W, W, W, M, M, M, M, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, B, B, W, W, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, B, B, B, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, M, M, M, W, W, W, W, W, W, W, F, _],
    [_, F, W, M, M, W, W, W, W, W, W, W, W, W, W, W, B, B, W, W, W, W, W, W, W, W, W, W, W, W, F, _],
    [_, F, W, W, W, W, W, W, B, B, B, W, W, W, W, W, W, W, W, W, W, W, W, W, M, M, M, M, W, W, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, _],
    [_, F, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, _],
    [_, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

/** Chair: 16x16 (1×1 tile) */
export const CHAIR_SPRITE: SpriteData = (() => {
  const W = '#8B6914', D = '#6B4E0A', B = '#5C3D0A', S = '#A07828';
  return [
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, D, B, B, B, B, B, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, S, S, S, S, B, D, _, _, _, _],
    [_, _, _, _, D, B, B, B, B, B, B, D, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, _, _, D, W, W, D, _, _, _, _, _, _],
    [_, _, _, _, _, _, D, W, W, D, _, _, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, _, D, _, _, _, _, D, _, _, _, _, _],
    [_, _, _, _, _, D, _, _, _, _, D, _, _, _, _, _],
  ];
})();

/** PC monitor: 16x16 (1×1 tile) */
export const PC_SPRITE: SpriteData = (() => {
  const F = '#555555', S = '#3A3A5C', B = '#6688CC', D = '#444444';
  return [
    [_, _, _, F, F, F, F, F, F, F, F, F, F, _, _, _],
    [_, _, _, F, S, S, S, S, S, S, S, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, B, B, B, B, B, B, S, F, _, _, _],
    [_, _, _, F, S, S, S, S, S, S, S, S, F, _, _, _],
    [_, _, _, F, F, F, F, F, F, F, F, F, F, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, D, D, D, D, _, _, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, _, D, D, D, D, D, D, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

/** Desk lamp: 16x16 (1×1 tile) */
export const LAMP_SPRITE: SpriteData = (() => {
  const Y = '#FFDD55', L = '#FFEE88', D = '#888888', B = '#555555', G = '#FFFFCC';
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, G, G, G, G, _, _, _, _, _, _],
    [_, _, _, _, _, G, Y, Y, Y, Y, G, _, _, _, _, _],
    [_, _, _, _, G, Y, Y, L, L, Y, Y, G, _, _, _, _],
    [_, _, _, _, Y, Y, L, L, L, L, Y, Y, _, _, _, _],
    [_, _, _, _, Y, Y, L, L, L, L, Y, Y, _, _, _, _],
    [_, _, _, _, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _],
    [_, _, _, _, _, _, D, D, D, D, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, D, D, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, D, D, D, D, _, _, _, _, _, _],
    [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
    [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

// ════════════════════════════════════════════════════════════
// ADDITIONAL PROPS (pixel-agents style, same art direction)
// ════════════════════════════════════════════════════════════

/** Sofa / Couch: 32x16 (2×1 tiles) — warm brown leather */
export const SOFA_SPRITE: SpriteData = (() => {
  const D = '#6B3A1A', M = '#8B4A2A', L = '#A05A3A', H = '#B06A4A', C = '#553018';
  const r: string[][] = [];
  // Back rest (top 6 rows)
  r.push([_, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, _]);
  r.push([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]);
  r.push([D, M, L, L, L, L, L, L, L, L, L, L, L, L, L, M, M, L, L, L, L, L, L, L, L, L, L, L, L, L, M, D]);
  r.push([D, M, L, H, H, H, H, H, H, H, H, H, H, H, L, M, M, L, H, H, H, H, H, H, H, H, H, H, L, L, M, D]);
  r.push([D, M, L, H, H, H, H, H, H, H, H, H, H, H, L, M, M, L, H, H, H, H, H, H, H, H, H, H, L, L, M, D]);
  r.push([D, M, L, L, L, L, L, L, L, L, L, L, L, L, L, M, M, L, L, L, L, L, L, L, L, L, L, L, L, L, M, D]);
  // Seat cushion (middle 6 rows)
  r.push([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]);
  r.push([D, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, D]);
  r.push([D, L, H, H, H, H, H, H, H, H, H, H, H, H, H, L, L, H, H, H, H, H, H, H, H, H, H, H, H, H, L, D]);
  r.push([D, L, H, H, H, H, H, H, H, H, H, H, H, H, H, L, L, H, H, H, H, H, H, H, H, H, H, H, H, H, L, D]);
  r.push([D, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, D]);
  // Armrest/front (bottom rows)
  r.push([D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D]);
  r.push([_, C, C, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, C, C, _]);
  r.push([_, C, C, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, C, C, _]);
  r.push([_, C, C, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, C, C, _]);
  r.push([_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]);
  return r;
})();

/** Trash can: 16x16 (1×1 tile) */
export const TRASHCAN_SPRITE: SpriteData = (() => {
  const D = '#666666', M = '#888888', L = '#999999', H = '#AAAAAA';
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, _, _, H, L, L, L, L, L, L, H, _, _, _, _],
    [_, _, _, _, M, M, M, M, M, M, M, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, M, D, D, D, D, D, D, M, _, _, _, _],
    [_, _, _, _, _, M, M, M, M, M, M, _, _, _, _, _],
    [_, _, _, _, _, _, M, M, M, M, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

/** Wall painting / picture frame: 16x16 (1×1 tile) */
export const PAINTING_SPRITE: SpriteData = (() => {
  const F = '#8B6914', D = '#6B4E0A';
  const S = '#88AACC', M = '#6688AA', G = '#446644', B = '#558855';
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, D, D, D, D, D, D, D, D, D, D, D, D, _, _],
    [_, _, D, F, F, F, F, F, F, F, F, F, F, D, _, _],
    [_, _, D, F, S, S, S, S, S, S, S, S, F, D, _, _],
    [_, _, D, F, S, S, S, M, S, S, S, S, F, D, _, _],
    [_, _, D, F, S, S, M, M, M, S, S, S, F, D, _, _],
    [_, _, D, F, S, M, M, M, M, M, S, S, F, D, _, _],
    [_, _, D, F, G, G, G, G, G, G, G, G, F, D, _, _],
    [_, _, D, F, G, B, G, G, B, G, G, B, F, D, _, _],
    [_, _, D, F, G, B, B, G, B, B, G, B, F, D, _, _],
    [_, _, D, F, G, G, G, G, G, G, G, G, F, D, _, _],
    [_, _, D, F, F, F, F, F, F, F, F, F, F, D, _, _],
    [_, _, D, D, D, D, D, D, D, D, D, D, D, D, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
})();

/** Vending machine: 16x32 (1×2 tiles) — tall blue/red machine */
export const VENDING_SPRITE: SpriteData = (() => {
  const F = '#4455AA', D = '#334488', L = '#5566BB', B = '#222244';
  const G = '#AABBCC', W = '#EEEEFF', R = '#CC4444', Y = '#FFDD55';
  const rows: string[][] = [];
  // Top cap
  rows.push([_, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _]);
  rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  // Brand area
  rows.push([_, _, B, F, F, F, F, F, F, F, F, F, F, B, _, _]);
  rows.push([_, _, B, F, W, W, W, W, W, W, W, W, F, B, _, _]);
  rows.push([_, _, B, F, W, R, R, R, R, R, R, W, F, B, _, _]);
  rows.push([_, _, B, F, W, W, W, W, W, W, W, W, F, B, _, _]);
  rows.push([_, _, B, F, F, F, F, F, F, F, F, F, F, B, _, _]);
  // Glass display
  rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  rows.push([_, _, B, D, G, G, G, G, G, G, G, G, D, B, _, _]);
  rows.push([_, _, B, D, G, L, L, G, G, L, L, G, D, B, _, _]);
  rows.push([_, _, B, D, G, L, L, G, G, L, L, G, D, B, _, _]);
  rows.push([_, _, B, D, G, G, G, G, G, G, G, G, D, B, _, _]);
  rows.push([_, _, B, D, G, L, L, G, G, L, L, G, D, B, _, _]);
  rows.push([_, _, B, D, G, L, L, G, G, L, L, G, D, B, _, _]);
  rows.push([_, _, B, D, G, G, G, G, G, G, G, G, D, B, _, _]);
  rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  // Coin slot area
  rows.push([_, _, B, F, F, F, F, F, F, F, F, F, F, B, _, _]);
  rows.push([_, _, B, F, _, _, _, _, B, B, _, _, F, F, B, _, _]);
  rows.push([_, _, B, F, _, _, _, _, B, B, _, _, F, F, B, _, _]);
  rows.push([_, _, B, F, F, F, F, F, F, F, F, F, F, B, _, _]);
  // Dispensing slot
  rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  rows.push([_, _, B, B, B, B, B, B, B, B, B, B, B, B, _, _]);
  rows.push([_, _, B, _, _, _, _, _, _, _, _, _, _, B, _, _]);
  rows.push([_, _, B, _, _, _, _, _, _, _, _, _, _, B, _, _]);
  // Legs
  rows.push([_, _, B, B, _, _, _, _, _, _, _, _, B, B, _, _]);
  rows.push([_, _, B, B, _, _, _, _, _, _, _, _, B, B, _, _]);
  // Padding
  rows.push(new Array(16).fill(_));
  rows.push(new Array(16).fill(_));
  rows.push(new Array(16).fill(_));
  rows.push(new Array(16).fill(_));
  rows.push(new Array(16).fill(_));
  rows.push(new Array(16).fill(_));
  return rows;
})();

/** Rug / carpet: 32x16 (2×1 tiles) — warm colored floor mat */
export const RUG_SPRITE: SpriteData = (() => {
  const D = '#8B4444', M = '#AA5555', L = '#CC7766', B = '#773333';
  const rows: string[][] = [];
  rows.push(new Array(32).fill(_));
  rows.push([_, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _]);
  for (let r = 0; r < 3; r++) {
    rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  }
  rows.push([_, _, B, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D, B, _, _]);
  rows.push([_, _, B, D, M, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, M, D, B, _, _]);
  rows.push([_, _, B, D, M, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, M, D, B, _, _]);
  rows.push([_, _, B, D, M, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, L, M, D, B, _, _]);
  rows.push([_, _, B, D, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, M, D, B, _, _]);
  for (let r = 0; r < 3; r++) {
    rows.push([_, _, B, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, D, B, _, _]);
  }
  rows.push([_, _, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, _, _]);
  rows.push(new Array(32).fill(_));
  return rows;
})();

// ════════════════════════════════════════════════════════════
// REGISTRATION
// ════════════════════════════════════════════════════════════

function registerSprite(scene: Phaser.Scene, key: string, data: SpriteData): void {
  if (scene.textures.exists(key)) return;
  const h = data.length;
  const w = h > 0 ? data[0]!.length : 0;
  if (w === 0 || h === 0) return;

  // Use Phaser's createCanvas API (most reliable for WebGL + Canvas renderers)
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex!.getContext();
  ctx.clearRect(0, 0, w, h);

  for (let y = 0; y < h; y++) {
    const row = data[y]!;
    for (let x = 0; x < w; x++) {
      const color = row[x];
      if (color && color !== '') {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  tex!.refresh();
}

/** Register ALL prop sprites. Call in PreloadScene. */
export function registerAllFurnitureSprites(scene: Phaser.Scene): void {
  // pixel-agents originals
  registerSprite(scene, 'pa-desk', DESK_SPRITE);
  registerSprite(scene, 'pa-bookshelf', BOOKSHELF_SPRITE);
  registerSprite(scene, 'pa-plant', PLANT_SPRITE);
  registerSprite(scene, 'pa-cooler', COOLER_SPRITE);
  registerSprite(scene, 'pa-whiteboard', WHITEBOARD_SPRITE);
  registerSprite(scene, 'pa-chair', CHAIR_SPRITE);
  registerSprite(scene, 'pa-pc', PC_SPRITE);
  registerSprite(scene, 'pa-lamp', LAMP_SPRITE);
  // Additional props
  registerSprite(scene, 'pa-sofa', SOFA_SPRITE);
  registerSprite(scene, 'pa-trashcan', TRASHCAN_SPRITE);
  registerSprite(scene, 'pa-painting', PAINTING_SPRITE);
  registerSprite(scene, 'pa-vending', VENDING_SPRITE);
  registerSprite(scene, 'pa-rug', RUG_SPRITE);
}
