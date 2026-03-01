export interface Point {
  x: number;
  y: number;
}

const DIRECTIONS: Point[] = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 },  // right
  { x: 0, y: 1 },  // down
  { x: -1, y: 0 }, // left
];

/**
 * BFS shortest path on a boolean walkable grid.
 * Returns the path from start to end (inclusive), or empty array if no path.
 */
export function findPath(
  walkable: boolean[][],
  start: Point,
  end: Point,
): Point[] {
  const height = walkable.length;
  if (height === 0) return [];
  const width = walkable[0]!.length;

  if (
    !inBounds(start, width, height) ||
    !inBounds(end, width, height) ||
    !walkable[start.y]![start.x] ||
    !walkable[end.y]![end.x]
  ) {
    return [];
  }

  if (start.x === end.x && start.y === end.y) {
    return [start];
  }

  const visited = Array.from({ length: height }, () => new Array<boolean>(width).fill(false));
  const parent = Array.from({ length: height }, () => new Array<Point | null>(width).fill(null));

  const queue: Point[] = [start];
  visited[start.y]![start.x] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const dir of DIRECTIONS) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;

      if (!inBounds({ x: nx, y: ny }, width, height)) continue;
      if (visited[ny]![nx]) continue;
      if (!walkable[ny]![nx]) continue;

      visited[ny]![nx] = true;
      parent[ny]![nx] = current;

      if (nx === end.x && ny === end.y) {
        return reconstructPath(parent, start, end);
      }

      queue.push({ x: nx, y: ny });
    }
  }

  return []; // No path found
}

function inBounds(p: Point, width: number, height: number): boolean {
  return p.x >= 0 && p.x < width && p.y >= 0 && p.y < height;
}

function reconstructPath(parent: (Point | null)[][], start: Point, end: Point): Point[] {
  const path: Point[] = [];
  let current: Point | null = end;

  while (current && !(current.x === start.x && current.y === start.y)) {
    path.unshift(current);
    current = parent[current.y]![current.x] ?? null;
  }

  path.unshift(start);
  return path;
}

/**
 * Build a walkable grid from the collision data array.
 */
export function buildWalkableGrid(
  collisionData: number[],
  width: number,
  height: number,
  collisionTiles: Set<number>,
): boolean[][] {
  const grid: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) {
      const tile = collisionData[y * width + x]!;
      row.push(!collisionTiles.has(tile));
    }
    grid.push(row);
  }
  return grid;
}
