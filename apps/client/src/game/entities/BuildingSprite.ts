import Phaser from 'phaser';
import type { BuildingState } from '@pixelops/world-model';
import { TILE_SIZE, LABEL_ZOOM_THRESHOLD } from '../constants';
import { EventBus } from '../EventBus';

/**
 * Generate desk workstation textures (2×1 tile = 32×16px).
 * 3 states: idle (off), active (glowing screen), alert (red).
 */
export function generateBuildingTextures(scene: Phaser.Scene): void {
  const states: BuildingState[] = ['idle', 'active', 'alert'];

  for (const state of states) {
    const key = `building-${state}`;
    if (scene.textures.exists(key)) continue;

    const w = TILE_SIZE * 2;
    const h = TILE_SIZE * 1;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    drawDeskWorkstation(ctx, w, h, state);
    const tex = scene.textures.createCanvas(key, w, h);
    const tCtx = tex!.getContext();
    tCtx.drawImage(canvas, 0, 0);
    tex!.refresh();
  }
}

function drawDeskWorkstation(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  state: BuildingState,
) {
  // Desk surface (wood)
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(0, 4, w, h - 4);
  // Desk top highlight
  ctx.fillStyle = '#A07828';
  ctx.fillRect(1, 4, w - 2, 2);
  // Desk edge
  ctx.fillStyle = '#6B4E0A';
  ctx.fillRect(0, h - 1, w, 1);

  // Monitor (left side of desk)
  ctx.fillStyle = '#333';
  ctx.fillRect(2, 0, 10, 8);
  // Screen
  if (state === 'active') {
    ctx.fillStyle = '#1a3a1a';
    ctx.fillRect(3, 1, 8, 6);
    // Green text lines
    ctx.fillStyle = '#0f0';
    ctx.fillRect(4, 2, 5, 1);
    ctx.fillRect(4, 4, 3, 1);
    ctx.fillRect(4, 5, 6, 1);
  } else if (state === 'alert') {
    ctx.fillStyle = '#3a1a1a';
    ctx.fillRect(3, 1, 8, 6);
    // Red warning
    ctx.fillStyle = '#f44';
    ctx.fillRect(5, 2, 4, 1);
    ctx.fillRect(6, 3, 2, 3);
  } else {
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(3, 1, 8, 6);
  }
  // Monitor stand
  ctx.fillStyle = '#444';
  ctx.fillRect(6, 8, 2, 2);

  // Keyboard (right side)
  ctx.fillStyle = '#555';
  ctx.fillRect(16, 6, 10, 4);
  ctx.fillStyle = '#666';
  ctx.fillRect(17, 7, 8, 2);
  // Keys
  ctx.fillStyle = '#777';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(18 + i * 2, 7, 1, 1);
  }

  // Monitor LED indicator
  if (state === 'active') {
    ctx.fillStyle = '#0f0';
  } else if (state === 'alert') {
    ctx.fillStyle = '#f00';
  } else {
    ctx.fillStyle = '#444';
  }
  ctx.fillRect(11, 6, 1, 1);
}

export class BuildingSprite extends Phaser.GameObjects.Image {
  public buildingId: string;
  public buildingName: string;
  public districtId: string;
  public state: BuildingState = 'idle';
  public tileX: number;
  public tileY: number;

  private nameLabel: Phaser.GameObjects.Text | null = null;

  constructor(
    scene: Phaser.Scene,
    config: {
      id: string;
      name: string;
      districtId: string;
      tileX: number;
      tileY: number;
    },
  ) {
    super(
      scene,
      config.tileX * TILE_SIZE + TILE_SIZE, // center of 2×1
      config.tileY * TILE_SIZE + TILE_SIZE / 2,
      'building-idle',
    );

    this.buildingId = config.id;
    this.buildingName = config.name;
    this.districtId = config.districtId;
    this.tileX = config.tileX;
    this.tileY = config.tileY;

    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      EventBus.emit('entity-clicked', {
        type: 'building',
        id: this.buildingId,
        name: this.buildingName,
        districtId: this.districtId,
        state: this.state,
        tileX: this.tileX,
        tileY: this.tileY,
      });
    });

    // Name label (high res for crisp text)
    this.nameLabel = scene.add.text(
      this.x, config.tileY * TILE_SIZE - 2,
      config.name,
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 2, y: 1 },
        resolution: 2,
      },
    );
    this.nameLabel.setOrigin(0.5, 1);
    this.nameLabel.setScale(0.5);
    this.nameLabel.setDepth(1500);
    this.nameLabel.setVisible(false);

    scene.add.existing(this);
    this.setDepth(this.y);
  }

  setBuildingState(newState: BuildingState) {
    if (this.state === newState) return;
    this.state = newState;
    this.setTexture(`building-${newState}`);

    if (newState === 'active' || newState === 'alert') {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        yoyo: true,
        ease: 'Sine.easeInOut',
      });
    }
  }

  updateLabelVisibility(zoom: number) {
    if (this.nameLabel) this.nameLabel.setVisible(zoom >= LABEL_ZOOM_THRESHOLD);
  }

  destroy(fromScene?: boolean) {
    this.nameLabel?.destroy();
    super.destroy(fromScene);
  }
}
