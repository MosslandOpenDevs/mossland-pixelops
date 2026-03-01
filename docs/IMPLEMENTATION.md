# PixelOps — 구현 상세 문서

## 아키텍처 개요

Mossland 생태계의 에이전트 활동을 실시간으로 시각화하는 2D 픽셀아트 시뮬레이션.

```
┌─────────────────────────────────────────┐
│  React UI                               │
│  ├── App.tsx (레이아웃 + 이벤트 버스)     │
│  ├── SidePanel.tsx (이벤트 로그)          │
│  ├── MockControls.tsx (시뮬레이션 제어)    │
│  └── ThemeSelector.tsx (맵 전환 UI)      │
├─────────────────────────────────────────┤
│  Phaser 3 Game Engine                    │
│  ├── PreloadScene (에셋 로드)            │
│  ├── WorldScene (맵 렌더링 + 에이전트)    │
│  └── AgentSprite (캐릭터 스프라이트)      │
├─────────────────────────────────────────┤
│  State Management (Zustand)              │
│  ├── worldStore.ts (에이전트/건물 상태)    │
│  └── reducer.ts (이벤트 → 상태 변환)     │
├─────────────────────────────────────────┤
│  World Model (@pixelops/world-model)     │
│  ├── districts.ts (디스트릭트 정의)       │
│  └── entities.ts (타입 정의)             │
└─────────────────────────────────────────┘
```

## 맵 시스템

### 두 가지 맵 모드

#### 1. Tiled JSON 맵 (권장)

[Tiled 에디터](https://www.mapeditor.org/)로 만든 `.json` 맵을 Phaser의 `tilemapTiledJSON`으로 직접 로드.

**사용 예시: Generative Agents "The Ville"**
- 맵: `the_ville.json` (140×100 타일, 32px)
- 타일셋: Room_Builder_32x32.png, interiors_pt1-5.png, CuteRPG_*.png 등 16개
- 레이어: Bottom Ground → Wall → Furniture → Foreground (17개 레이어)
- Phaser가 모든 레이어를 자동 렌더링

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

**새 맵 추가 방법:**
1. Tiled 에디터에서 맵 생성 → JSON으로 Export
2. `public/assets/` 에 JSON + 타일셋 PNG 배치
3. `mapConfig.ts`의 `MAPS` 배열에 추가

#### 2. 이미지 배경 맵

디자인 이미지 PNG를 그대로 배경으로 사용. 별도 collision JSON으로 걷기 영역 정의.

**사용 예시: Office Level 3**
- 배경: `office_level3.png` (512×448px)
- 충돌: `office_level3_collision.json` (32×28 타일의 walkable boolean 그리드)

```typescript
// PreloadScene
this.load.image('map-bg', 'assets/office/office_level3.png');
this.load.json('map-collision', 'assets/office/office_level3_collision.json');

// WorldScene
const bg = this.add.image(0, 0, 'map-bg');
bg.setOrigin(0, 0);
```

**Collision JSON 생성:** Python Pillow로 디자인 이미지의 각 16×16 영역 분석, 밝은 영역 = walkable.

### 맵 전환

`mapConfig.ts`에서 맵을 정의하고, UI 드롭다운으로 런타임 전환:

```typescript
export const MAPS: MapConfig[] = [
  { id: 'the-ville', label: 'The Ville', type: 'tiled', ... },
  { id: 'office-level3', label: 'Office Level 3', type: 'image', ... },
];
```

맵 변경 시 React에서 Phaser `key`를 변경하여 게임 인스턴스를 재생성.

## 캐릭터 시스템

### MetroCity 스프라이트

pixel-agents 프로젝트에서 가져온 `char_0.png` ~ `char_5.png` (CC0 라이선스).

- 크기: 112×96 (7프레임 × 3방향, 각 16×32px)
- 방향: Row 0=down, Row 1=up, Row 2=right (left=flip right)
- 프레임: walk1(0), walk2/idle(1), walk3(2), type1(3), type2(4), read1(5), read2(6)

### 스케일 자동 조정

맵 타일 크기에 따라 캐릭터 스케일 자동 결정:
```typescript
const charScale = TILE_SIZE / 16; // 32px 맵 → 2x, 16px 맵 → 1x
this.setScale(charScale);
```

### 에이전트 행동

- **idle**: 대기 → 랜덤 타이머 후 wander
- **walking**: BFS 경로 탐색 → 타일 단위 이동
- **working**: typing/reading 애니메이션 (이벤트에 의해 트리거)

## 에셋 관리

### 디렉토리 구조

```
assets/
├── downloads.txt          — 에셋 다운로드 URL (커밋됨)
├── free/                  — 무료 에셋 (gitignore)
│   └── MetroCity/         — CC0 캐릭터 팩
└── paid/                  — 유료 에셋 (gitignore)
    ├── Office Interior Tileset (16x16)/   — donarg.itch.io
    ├── Modern Interiors - RPG Tileset/     — limezu.itch.io
    └── Modern Office - Revamped/           — limezu.itch.io

apps/client/public/assets/  — 런타임 에셋 (gitignore)
├── characters/             — MetroCity char_0-5.png
├── ga/                     — Generative Agents 맵 + 타일셋
│   ├── the_ville.json
│   └── tilesets/
├── office/                 — 오피스 맵 디자인 PNG + collision
└── walls.png               — pixel-agents 벽 오토타일
```

### 에셋 설정 방법

1. `assets/downloads.txt`의 URL에서 에셋 팩 다운로드
2. `assets/free/`, `assets/paid/`에 압축 해제
3. `scripts/download-assets.sh` 실행 (또는 수동으로 `public/assets/`에 복사)

## 참고 프로젝트

| 프로젝트 | 역할 | 가져온 것 |
|---------|------|----------|
| [pixel-agents](https://github.com/pablodelucca/pixel-agents) | UI/UX 참고 | 캐릭터 PNG, walls.png, 다크 테마 CSS |
| [generative_agents](https://github.com/joonspk-research/generative_agents) | 맵 시스템 참고 | Tiled JSON 맵 로딩 방식, 타일셋 에셋, 레이어 구조 |

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Game Engine**: Phaser 3.90
- **State**: Zustand
- **Build**: Vite + pnpm workspaces
- **Map Editor**: [Tiled](https://www.mapeditor.org/) (외부 도구)
