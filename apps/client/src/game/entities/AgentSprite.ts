import Phaser from 'phaser';
import type { AgentState } from '@pixelops/world-model';
import { findPath, type Point } from '../pathfinding/bfs';
import {
  TILE_SIZE,
  AGENT_SPEED,
  WANDER_MIN_DELAY,
  WANDER_MAX_DELAY,
  WORK_DURATION,
  CHAR_FRAME_H,
  LABEL_ZOOM_THRESHOLD,
  type WorkAnim,
} from '../constants';
import { EventBus } from '../EventBus';

type Direction = 'down' | 'left' | 'right' | 'up';

const NUM_CHAR_SPRITES = 6; // char_0.png through char_5.png

export function eventTypeToWorkAnim(eventType?: string): WorkAnim {
  if (!eventType) return 'typing';
  if (eventType.includes('read') || eventType.includes('issue') || eventType.includes('signal')) return 'reading';
  return 'typing';
}

/**
 * No-op: character textures are now loaded from PNG files in PreloadScene.
 * Kept for backward compatibility.
 */
export function generateCharacterTextures(_scene: Phaser.Scene): void {
  // Characters loaded from char_0.png - char_5.png via PreloadScene.preload()
}

export class AgentSprite extends Phaser.GameObjects.Sprite {
  public agentId: string;
  public agentName: string;
  public districtId: string;
  public agentState: AgentState = 'idle';
  public tileX: number;
  public tileY: number;

  private path: Point[] = [];
  private pathIndex = 0;
  private _moveProgress = 0;
  private wanderTimer = 0;
  private workTimer = 0;
  private direction: Direction = 'down';
  private walkableGrid: boolean[][] = [];
  private districtBounds: { minX: number; minY: number; maxX: number; maxY: number };
  private spriteIndex: number;
  private charKey: string;
  private workAnim: WorkAnim = 'typing';

  private nameLabel: Phaser.GameObjects.Text | null = null;

  constructor(
    scene: Phaser.Scene,
    config: {
      id: string;
      name: string;
      districtId: string;
      tileX: number;
      tileY: number;
      spriteIndex: number;
      walkableGrid: boolean[][];
      districtBounds: { minX: number; minY: number; maxX: number; maxY: number };
    },
  ) {
    // Use the loaded character spritesheet (cycle through 6 palettes)
    const charIdx = config.spriteIndex % NUM_CHAR_SPRITES;
    const charKey = `char-${charIdx}`;

    super(
      scene,
      config.tileX * TILE_SIZE + TILE_SIZE / 2,
      config.tileY * TILE_SIZE + TILE_SIZE / 2,
      charKey,
      1, // idle frame (walk2 = standing pose)
    );

    this.charKey = charKey;
    this.agentId = config.id;
    this.agentName = config.name;
    this.districtId = config.districtId;
    this.tileX = config.tileX;
    this.tileY = config.tileY;
    this.spriteIndex = config.spriteIndex;
    this.walkableGrid = config.walkableGrid;
    this.districtBounds = config.districtBounds;

    // Bottom-anchor (character feet at tile center)
    this.setOrigin(0.5, 1);

    // Scale to match tile grid (MetroCity chars are 16px wide)
    // 32px tiles → scale 2x, 16px tiles → scale 1x
    const charScale = TILE_SIZE / 16;
    this.setScale(charScale);

    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      EventBus.emit('entity-clicked', {
        type: 'agent',
        id: this.agentId,
        name: this.agentName,
        districtId: this.districtId,
        state: this.agentState,
        tileX: this.tileX,
        tileY: this.tileY,
      });
    });

    // Name label (positioned above scaled character)
    const shortName = this.agentName.split('(')[0]!.trim();
    this.nameLabel = scene.add.text(this.x, this.y - CHAR_FRAME_H * 2, shortName, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 3, y: 1 },
      resolution: 2,
    });
    this.nameLabel.setOrigin(0.5, 1);
    this.nameLabel.setDepth(2000);
    this.nameLabel.setVisible(false);

    this.wanderTimer = Phaser.Math.Between(WANDER_MIN_DELAY, WANDER_MAX_DELAY);
    scene.add.existing(this as Phaser.GameObjects.GameObject);
    this.setDepth(this.y);
  }

  update(_time: number, delta: number) {
    switch (this.agentState) {
      case 'idle':
        this.updateIdle(delta);
        break;
      case 'walking':
        this.updateWalk(delta);
        break;
      case 'working':
        this.updateWork(delta);
        break;
    }

    this.setDepth(this.y);
    // Flip for left direction
    this.setFlipX(this.direction === 'left');

    if (this.nameLabel) {
      this.nameLabel.setPosition(this.x, this.y - CHAR_FRAME_H * 2);
    }
  }

  updateLabelVisibility(zoom: number) {
    if (this.nameLabel) this.nameLabel.setVisible(zoom >= LABEL_ZOOM_THRESHOLD);
  }

  private getAnimKey(type: string): string {
    return `${this.charKey}-${type}`;
  }

  private updateIdle(delta: number) {
    const dir = this.direction === 'left' ? 'right' : this.direction;
    const idleAnim = this.getAnimKey(`idle-${dir}`);
    if (this.anims.currentAnim?.key !== idleAnim) {
      this.play(idleAnim);
    }

    this.wanderTimer -= delta;
    if (this.wanderTimer <= 0) {
      this.startWander();
    }
  }

  private updateWalk(delta: number) {
    if (this.pathIndex >= this.path.length) {
      this.setAgentState('idle');
      return;
    }

    const target = this.path[this.pathIndex]!;
    const targetX = target.x * TILE_SIZE + TILE_SIZE / 2;
    const targetY = target.y * TILE_SIZE + TILE_SIZE / 2;

    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left';
    } else if (dy !== 0) {
      this.direction = dy > 0 ? 'down' : 'up';
    }

    const dir = this.direction === 'left' ? 'right' : this.direction;
    const walkAnim = this.getAnimKey(`walk-${dir}`);
    if (this.anims.currentAnim?.key !== walkAnim) {
      this.play(walkAnim);
    }

    const speed = AGENT_SPEED * TILE_SIZE * (delta / 1000);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= speed) {
      this.x = targetX;
      this.y = targetY;
      this.tileX = target.x;
      this.tileY = target.y;
      this.pathIndex++;
    } else {
      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed;
    }
  }

  private updateWork(delta: number) {
    const workAnimKey = this.getAnimKey(`work-${this.workAnim}`);
    if (this.anims.currentAnim?.key !== workAnimKey) {
      this.play(workAnimKey);
    }

    this.workTimer -= delta;
    if (this.workTimer <= 0) {
      this.setAgentState('idle');
    }
  }

  setAgentState(newState: AgentState) {
    this.agentState = newState;
    switch (newState) {
      case 'idle':
        this.wanderTimer = Phaser.Math.Between(WANDER_MIN_DELAY, WANDER_MAX_DELAY);
        break;
      case 'working':
        this.workTimer = WORK_DURATION;
        break;
    }
  }

  private startWander() {
    const { minX, minY, maxX, maxY } = this.districtBounds;
    let attempts = 0;
    let targetX: number, targetY: number;

    do {
      targetX = Phaser.Math.Between(minX, maxX);
      targetY = Phaser.Math.Between(minY, maxY);
      attempts++;
    } while (
      attempts < 30 &&
      (!this.walkableGrid[targetY]?.[targetX] ||
        (targetX === this.tileX && targetY === this.tileY))
    );

    if (attempts >= 30) {
      this.wanderTimer = Phaser.Math.Between(WANDER_MIN_DELAY, WANDER_MAX_DELAY);
      return;
    }

    const path = findPath(this.walkableGrid, { x: this.tileX, y: this.tileY }, { x: targetX, y: targetY });

    if (path.length > 1) {
      this.path = path;
      this.pathIndex = 1;
      this.agentState = 'walking';
    } else {
      this.wanderTimer = Phaser.Math.Between(WANDER_MIN_DELAY, WANDER_MAX_DELAY);
    }
  }

  applyStoreState(agentState: AgentState, eventType?: string) {
    if (agentState === 'working' && this.agentState !== 'working') {
      this.workAnim = eventTypeToWorkAnim(eventType);
      this.setAgentState('working');
    }
  }

  destroy(fromScene?: boolean) {
    this.nameLabel?.destroy();
    super.destroy(fromScene);
  }
}
