# ADR-002: Phaser 3 as 2D Rendering Engine

## Status
Accepted

## Context
PixelOps needs a 2D game engine to render a pixel-art world with:
- Tilemap rendering (districts, buildings)
- Sprite animation (agents with state-driven animations)
- Camera controls (pan, zoom)
- Click/hover interaction on entities
- Stable 60fps performance

Options considered:
1. **Kaboom.js** — Simple API, but officially listed as "no longer maintained."
2. **Phaser 3** — Mature, actively maintained, large community, official React/TS templates.
3. **PixiJS** — Low-level renderer, no built-in game features (tilemap, physics, scenes).
4. **Custom Canvas/WebGL** — Maximum control, but high development cost.

## Decision
Use **Phaser 3** as the 2D rendering engine.

## Rationale
- **Actively maintained** with regular releases and security patches.
- **Official TypeScript support** and React integration templates.
- **Built-in tilemap support** (Tiled JSON format) — critical for district layouts.
- **Sprite animation system** — state machines for agent animations out of the box.
- **Large ecosystem** — plugins, community examples, extensive documentation.
- **Proven at scale** — used in production by many game projects.

Kaboom was rejected due to maintenance concerns. PixiJS was rejected because we would need to build tilemap, animation, and scene management ourselves. Custom rendering was rejected due to development cost.

## Consequences
- Phaser's game loop runs independently from React's render cycle. State synchronization via Zustand bridges both worlds.
- Bundle size is larger than PixiJS (~1MB vs ~300KB), acceptable for a dashboard app.
- Team needs familiarity with Phaser's scene lifecycle and API.

## References
- [Phaser official site](https://phaser.io/)
- [Phaser React template](https://github.com/phaserjs/template-react-ts)
- [Kaboom maintenance status](https://kaboomjs.com/)
