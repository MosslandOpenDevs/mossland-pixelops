import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { getCurrentMap } from '../mapConfig';
import {
  CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX, CAMERA_ZOOM_STEP, CAMERA_SCROLL_SPEED,
  LABEL_ZOOM_THRESHOLD,
} from '../constants';
import { AgentSprite } from '../entities/AgentSprite';
import { createWorkingSparks, emitEventArrival } from '../effects/EventEffects';
import { useWorldStore } from '../../store/worldStore';
import { AGENT_POOL, createInitialAgents, createInitialBuildings } from '../../mock/agentPool';
import { startMockEvents, stopMockEvents } from '../../mock/MockEventGenerator';

export class WorldScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private agentSprites: Map<string, AgentSprite> = new Map();
  private walkableGrid: boolean[][] = [];
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private unsubscribeStore?: () => void;
  private fpsUpdateTimer = 0;
  private workingEmitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter> = new Map();
  private lastZoom = 0;

  constructor() { super({ key: 'WorldScene' }); }

  create() {
    const cfg = getCurrentMap();
    let worldW: number, worldH: number;
    let mapW: number, mapH: number;
    const tileSize = cfg.tileSize;

    if (cfg.type === 'tiled') {
      // ── TILED MAP (Generative Agents style) ──
      const result = this.createTiledMap(cfg);
      worldW = result.worldW;
      worldH = result.worldH;
      mapW = result.mapW;
      mapH = result.mapH;
    } else {
      // ── IMAGE MAP (design PNG as background) ──
      const result = this.createImageMap(cfg);
      worldW = result.worldW;
      worldH = result.worldH;
      mapW = result.mapW;
      mapH = result.mapH;
    }

    // ── Camera ──
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setZoom(cfg.defaultZoom);
    this.cameras.main.centerOn(worldW / 2, worldH / 2);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.isDragging = true; this.dragStartX = p.x; this.dragStartY = p.y;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.isDragging && p.isDown) {
        const c = this.cameras.main;
        c.scrollX -= (p.x - this.dragStartX) / c.zoom;
        c.scrollY -= (p.y - this.dragStartY) / c.zoom;
        this.dragStartX = p.x; this.dragStartY = p.y;
      }
    });
    this.input.on('pointerup', () => { this.isDragging = false; });
    this.input.on('wheel', (_p: Phaser.Input.Pointer, _gx: number, _gy: number, _dx: number, dy: number) => {
      const c = this.cameras.main;
      c.setZoom(Phaser.Math.Clamp(c.zoom - dy * 0.001 * CAMERA_ZOOM_STEP * 10, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX));
    });

    // ── Agents ──
    const initA = createInitialAgents();
    useWorldStore.getState().initAgents(initA);
    useWorldStore.getState().initBuildings(createInitialBuildings());

    const charScale = tileSize / 16;
    for (const def of AGENT_POOL) {
      let sx = Math.floor(mapW / 2), sy = Math.floor(mapH / 2);
      for (let a = 0; a < 100; a++) {
        const tx = 2 + Math.floor(Math.random() * (mapW - 4));
        const ty = 2 + Math.floor(Math.random() * (mapH - 4));
        if (this.walkableGrid[ty]?.[tx]) { sx = tx; sy = ty; break; }
      }
      const agent = new AgentSprite(this, {
        id: def.id, name: def.name, districtId: def.districtId,
        tileX: sx, tileY: sy, spriteIndex: def.spriteIndex,
        walkableGrid: this.walkableGrid,
        districtBounds: { minX: 2, minY: 2, maxX: mapW - 2, maxY: mapH - 2 },
      });
      this.agentSprites.set(def.id, agent);
    }

    // ── Store ──
    this.unsubscribeStore = useWorldStore.subscribe((s, p) => {
      for (const [id, a] of Object.entries(s.agents)) {
        if (p.agents[id] && a.state !== p.agents[id]!.state) {
          const sp = this.agentSprites.get(id);
          if (sp) {
            sp.applyStoreState(a.state, a.lastEventType);
            if (a.state === 'working') { this.startSparks(id, sp.x, sp.y); emitEventArrival(this, sp.x, sp.y); }
            else this.stopSparks(id);
          }
        }
      }
    });
    EventBus.on('camera-follow', (id: string) => {
      const a = this.agentSprites.get(id);
      if (a) this.cameras.main.pan(a.x, a.y, 500, 'Sine.easeInOut');
    });
    startMockEvents();
    EventBus.emit('world-ready');
  }

  private createTiledMap(cfg: ReturnType<typeof getCurrentMap>) {
    const map = this.make.tilemap({ key: 'map' });
    const tilesetObjs: Phaser.Tilemaps.Tileset[] = [];
    for (const ts of cfg.tilesets ?? []) {
      const obj = map.addTilesetImage(ts.tiledName, ts.key);
      if (obj) tilesetObjs.push(obj);
    }

    let collisionsLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    for (const layerData of map.layers) {
      const name = layerData.name;
      if (['Arena Blocks', 'Sector Blocks', 'World Blocks', 'Spawning Blocks',
           'Special Blocks Registry', 'Object Interaction Blocks'].includes(name)) continue;
      if (name === 'Collisions') {
        collisionsLayer = map.createLayer(name, tilesetObjs, 0, 0);
        if (collisionsLayer) { collisionsLayer.setDepth(-1); collisionsLayer.setVisible(false); }
        continue;
      }
      const layer = map.createLayer(name, tilesetObjs, 0, 0);
      if (layer && name.includes('Foreground')) layer.setDepth(2);
    }

    const mapW = map.width, mapH = map.height;
    this.walkableGrid = [];
    for (let y = 0; y < mapH; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < mapW; x++) {
        row.push(!collisionsLayer?.getTileAt(x, y));
      }
      this.walkableGrid.push(row);
    }

    return { worldW: mapW * map.tileWidth, worldH: mapH * map.tileHeight, mapW, mapH };
  }

  private createImageMap(cfg: ReturnType<typeof getCurrentMap>) {
    // Place design PNG as background
    const bg = this.add.image(0, 0, 'map-bg');
    bg.setOrigin(0, 0);
    bg.setDepth(-10);

    const worldW = bg.width;
    const worldH = bg.height;
    const tileSize = cfg.tileSize;
    const mapW = Math.floor(worldW / tileSize);
    const mapH = Math.floor(worldH / tileSize);

    // Load collision data
    const collisionData = this.cache.json.get('map-collision') as {
      cols: number; rows: number; walkable: boolean[][];
    } | null;

    this.walkableGrid = [];
    if (collisionData) {
      this.walkableGrid = collisionData.walkable;
    } else {
      for (let y = 0; y < mapH; y++) {
        this.walkableGrid.push(new Array(mapW).fill(true));
      }
    }

    return { worldW, worldH, mapW, mapH };
  }

  update(time: number, delta: number) {
    const dt = Math.min(delta, 100);
    const c = this.cameras.main;
    if (this.cursors.left.isDown) c.scrollX -= CAMERA_SCROLL_SPEED;
    if (this.cursors.right.isDown) c.scrollX += CAMERA_SCROLL_SPEED;
    if (this.cursors.up.isDown) c.scrollY -= CAMERA_SCROLL_SPEED;
    if (this.cursors.down.isDown) c.scrollY += CAMERA_SCROLL_SPEED;
    for (const a of this.agentSprites.values()) a.update(time, dt);
    for (const [id, e] of this.workingEmitters) {
      const s = this.agentSprites.get(id); if (s) e.setPosition(s.x, s.y - 20);
    }
    if (Math.abs(c.zoom - this.lastZoom) > 0.01) {
      this.lastZoom = c.zoom;
      for (const a of this.agentSprites.values()) a.updateLabelVisibility(c.zoom);
    }
    this.fpsUpdateTimer += dt;
    if (this.fpsUpdateTimer >= 500) { this.fpsUpdateTimer = 0; useWorldStore.getState().setFps(Math.round(this.game.loop.actualFps)); }
  }

  private startSparks(id: string, x: number, y: number) { this.stopSparks(id); this.workingEmitters.set(id, createWorkingSparks(this, x, y)); }
  private stopSparks(id: string) { const e = this.workingEmitters.get(id); if (e) { e.stop(); this.time.delayedCall(600, () => e.destroy()); this.workingEmitters.delete(id); } }

  shutdown() {
    stopMockEvents(); this.unsubscribeStore?.();
    for (const e of this.workingEmitters.values()) e.destroy();
    this.workingEmitters.clear(); EventBus.removeAllListeners();
  }
}
