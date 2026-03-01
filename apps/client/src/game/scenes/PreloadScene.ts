import Phaser from 'phaser';
import { getCurrentMap } from '../mapConfig';
import { generateParticleTextures } from '../effects/EventEffects';

export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  preload() {
    const cfg = getCurrentMap();

    if (cfg.type === 'tiled') {
      this.load.tilemapTiledJSON('map', cfg.jsonPath!);
      for (const ts of cfg.tilesets ?? []) {
        this.load.image(ts.key, ts.path);
      }
    } else {
      // Image-based map
      this.load.image('map-bg', cfg.imagePath!);
      this.load.json('map-collision', cfg.collisionPath!);
    }

    // Characters
    for (let i = 0; i < 6; i++) {
      this.load.spritesheet(`char-${i}`, `assets/characters/char_${i}.png`, {
        frameWidth: 16, frameHeight: 32,
      });
    }
  }

  create() {
    for (let i = 0; i < 6; i++) {
      const k = `char-${i}`;
      this.anims.create({ key: `${k}-walk-down`, frames: this.anims.generateFrameNumbers(k, { frames: [0, 1, 2, 1] }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `${k}-walk-up`, frames: this.anims.generateFrameNumbers(k, { frames: [7, 8, 9, 8] }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `${k}-walk-right`, frames: this.anims.generateFrameNumbers(k, { frames: [14, 15, 16, 15] }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `${k}-walk-left`, frames: this.anims.generateFrameNumbers(k, { frames: [14, 15, 16, 15] }), frameRate: 6, repeat: -1 });
      this.anims.create({ key: `${k}-idle-down`, frames: [{ key: k, frame: 1 }], frameRate: 1 });
      this.anims.create({ key: `${k}-idle-up`, frames: [{ key: k, frame: 8 }], frameRate: 1 });
      this.anims.create({ key: `${k}-idle-right`, frames: [{ key: k, frame: 15 }], frameRate: 1 });
      this.anims.create({ key: `${k}-idle-left`, frames: [{ key: k, frame: 15 }], frameRate: 1 });
      this.anims.create({ key: `${k}-work-typing`, frames: this.anims.generateFrameNumbers(k, { frames: [3, 4] }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: `${k}-work-reading`, frames: this.anims.generateFrameNumbers(k, { frames: [5, 6] }), frameRate: 2, repeat: -1 });
      this.anims.create({ key: `${k}-work`, frames: this.anims.generateFrameNumbers(k, { frames: [3, 4] }), frameRate: 3, repeat: -1 });
    }

    generateParticleTextures(this);
    this.scene.start('WorldScene');
  }
}
