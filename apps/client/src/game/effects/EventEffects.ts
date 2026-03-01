import Phaser from 'phaser';
import { PARTICLE_KEYS, PARTICLE_SIZE } from '../constants';

const PARTICLE_COLORS: Record<string, number> = {
  'particle-green': 0x2ecc71,
  'particle-blue': 0x3498db,
  'particle-red': 0xe74c3c,
  'particle-yellow': 0xf1c40f,
  'particle-orange': 0xe67e22,
  'particle-white': 0xffffff,
};

export function generateParticleTextures(scene: Phaser.Scene): void {
  for (const key of PARTICLE_KEYS) {
    if (scene.textures.exists(key)) continue;

    const color = PARTICLE_COLORS[key] ?? 0xffffff;
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const tex = scene.textures.createCanvas(key, PARTICLE_SIZE, PARTICLE_SIZE);
    const ctx = tex!.getContext();
    ctx.clearRect(0, 0, PARTICLE_SIZE, PARTICLE_SIZE);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(1, 0, 2, 4);
    ctx.fillRect(0, 1, 4, 2);
    tex!.refresh();
  }
}

export function createWorkingSparks(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Particles.ParticleEmitter {
  const emitter = scene.add.particles(x, y - 20, 'particle-yellow', {
    speed: { min: 10, max: 25 },
    angle: { min: -120, max: -60 },
    lifespan: 500,
    frequency: 250,
    quantity: 1,
    scale: { start: 0.8, end: 0 },
    alpha: { start: 0.8, end: 0 },
    gravityY: -15,
  });
  emitter.setDepth(3000);
  return emitter;
}

export function emitBuildingActivation(scene: Phaser.Scene, x: number, y: number): void {
  const emitter = scene.add.particles(x, y, 'particle-blue', {
    speed: { min: 30, max: 60 },
    lifespan: 350,
    quantity: 6,
    scale: { start: 0.8, end: 0 },
    alpha: { start: 0.7, end: 0 },
    emitting: false,
  });
  emitter.setDepth(3000);
  emitter.explode(6, x, y);
  scene.time.delayedCall(400, () => emitter.destroy());
}

export function createAlertParticles(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Particles.ParticleEmitter {
  const emitter = scene.add.particles(x, y - 10, 'particle-red', {
    speed: { min: 5, max: 15 },
    angle: { min: -100, max: -80 },
    lifespan: 600,
    frequency: 350,
    quantity: 1,
    scale: { start: 0.6, end: 0 },
    alpha: { start: 0.6, end: 0 },
    gravityY: -20,
  });
  emitter.setDepth(3000);
  return emitter;
}

export function emitEventArrival(scene: Phaser.Scene, targetX: number, targetY: number): void {
  const cam = scene.cameras.main;
  const edges = [
    { x: cam.scrollX, y: targetY },
    { x: cam.scrollX + cam.width / cam.zoom, y: targetY },
    { x: targetX, y: cam.scrollY },
    { x: targetX, y: cam.scrollY + cam.height / cam.zoom },
  ];
  const start = edges[Math.floor(Math.random() * edges.length)]!;

  const spark = scene.add.image(start.x, start.y, 'particle-orange');
  spark.setDepth(4000);
  spark.setScale(1.2);

  scene.tweens.add({
    targets: spark,
    x: targetX,
    y: targetY,
    duration: 500,
    ease: 'Sine.easeIn',
    onComplete: () => {
      spark.destroy();
      const emitter = scene.add.particles(targetX, targetY, 'particle-orange', {
        speed: { min: 15, max: 40 },
        lifespan: 250,
        quantity: 4,
        scale: { start: 0.6, end: 0 },
        alpha: { start: 0.8, end: 0 },
        emitting: false,
      });
      emitter.setDepth(4000);
      emitter.explode(4, targetX, targetY);
      scene.time.delayedCall(300, () => emitter.destroy());
    },
  });
}
