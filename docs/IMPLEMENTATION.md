# PixelOps — Implementation Details

## Architecture Overview

A 2D pixel-art simulation that visualizes agent activity in the Mossland ecosystem in real time.

```
┌─────────────────────────────────────────┐
│  React UI                               │
│  ├── App.tsx (layout + event bus)        │
│  ├── SidePanel.tsx (event log)           │
│  ├── MockControls.tsx (simulation ctrl)  │
│  └── ThemeSelector.tsx (map switcher)    │
├─────────────────────────────────────────┤
│  Phaser 3 Game Engine                    │
│  ├── PreloadScene (asset loading)        │
│  ├── WorldScene (map render + agents)    │
│  └── AgentSprite (character sprite)      │
├─────────────────────────────────────────┤
│  State Management (Zustand)              │
│  ├── worldStore.ts (agent/building state)│
│  └── reducer.ts (event → state)          │
├─────────────────────────────────────────┤
│  World Model (@pixelops/world-model)     │
│  ├── districts.ts (district definitions) │
│  └── entities.ts (type definitions)      │
└─────────────────────────────────────────┘
```

## Map System

### Two Map Modes

#### 1. Tiled JSON Map (Recommended)

Loads `.json` maps created with [Tiled editor](https://www.mapeditor.org/) via Phaser's `tilemapTiledJSON`.

**Example: Generative Agents "The Ville"**
- Map: `the_ville.json` (140×100 tiles, 32px)
- Tilesets: Room_Builder_32x32.png, interiors_pt1-5.png, CuteRPG_*.png (16 total)
- Layers: Bottom Ground → Wall → Furniture → Foreground (17 layers)
- Phaser renders all layers automatically

```typescript
// PreloadScene
this.load.tilemapTiledJSON('map', 'assets/ga/the_ville.json');
this.load.image('walls', 'assets/ga/tilesets/Room_Builder_32x32.png');

// WorldScene
const map = this.make.tilemap({ key: 'map' });
const walls = map.addTilesetImage('Room_Builder_32x32', 'walls');
map.createLayer('Bottom Ground', [walls, ...], 0, 0);
map.createLayer('Wall', [walls, ...], 0, 0);
```

**Adding a new map:**
1. Create map in Tiled editor → Export as JSON
2. Place JSON + tileset PNGs in `public/assets/`
3. Add entry to `MAPS` array in `mapConfig.ts`

#### 2. Image Background Map

Uses a design image PNG directly as the background. Collision grid defined in a separate JSON.

**Example: Office Level 3**
- Background: `office_level3.png` (512×448px)
- Collision: `office_level3_collision.json` (32×28 walkable boolean grid)

```typescript
// PreloadScene
this.load.image('map-bg', 'assets/office/office_level3.png');
this.load.json('map-collision', 'assets/office/office_level3_collision.json');

// WorldScene
const bg = this.add.image(0, 0, 'map-bg');
bg.setOrigin(0, 0);
```

**Collision JSON generation:** Python Pillow analyzes each 16×16 region of the design image; bright areas = walkable.

### Map Switching

Maps are defined in `mapConfig.ts` and switched at runtime via a UI dropdown:

```typescript
export const MAPS: MapConfig[] = [
  { id: 'the-ville', label: 'The Ville', type: 'tiled', ... },
  { id: 'office-level3', label: 'Office Level 3', type: 'image', ... },
];
```

On map change, React updates the Phaser `key` prop to recreate the game instance.

## Character System

### MetroCity Sprites

`char_0.png` through `char_5.png` from the pixel-agents project (CC0 license).

- Size: 112×96 (7 frames × 3 directions, each 16×32px)
- Directions: Row 0=down, Row 1=up, Row 2=right (left=flip right)
- Frames: walk1(0), walk2/idle(1), walk3(2), type1(3), type2(4), read1(5), read2(6)

### Auto-Scaling

Character scale is automatically determined by the map tile size:
```typescript
const charScale = TILE_SIZE / 16; // 32px map → 2x, 16px map → 1x
this.setScale(charScale);
```

### Agent Behavior

- **idle**: wait → wander after random timer
- **walking**: BFS pathfinding → tile-by-tile movement
- **working**: typing/reading animation (triggered by events)

## Asset Management

### Directory Structure

```
assets/
├── downloads.txt          — asset download URLs (committed)
├── free/                  — free assets (gitignored)
│   └── MetroCity/         — CC0 character pack
└── paid/                  — paid assets (gitignored)
    ├── Office Interior Tileset (16x16)/   — donarg.itch.io
    ├── Modern Interiors - RPG Tileset/     — limezu.itch.io
    └── Modern Office - Revamped/           — limezu.itch.io

apps/client/public/assets/  — runtime assets (gitignored)
├── characters/             — MetroCity char_0-5.png
├── ga/                     — Generative Agents map + tilesets
│   ├── the_ville.json
│   └── tilesets/
├── office/                 — office map design PNGs + collision
└── walls.png               — pixel-agents wall auto-tile
```

### Asset Setup

1. Download asset packs from URLs in `assets/downloads.txt`
2. Extract to `assets/free/` and `assets/paid/`
3. Run `scripts/download-assets.sh` (or manually copy to `public/assets/`)

## Reference Projects

| Project | Role | What we used |
|---------|------|-------------|
| [pixel-agents](https://github.com/pablodelucca/pixel-agents) | UI/UX reference | Character PNGs, walls.png, dark theme CSS |
| [generative_agents](https://github.com/joonspk-research/generative_agents) | Map system reference | Tiled JSON map loading, tileset assets, layer structure |

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Game Engine**: Phaser 3.90
- **State**: Zustand
- **Build**: Vite + pnpm workspaces
- **Map Editor**: [Tiled](https://www.mapeditor.org/) (external tool)
