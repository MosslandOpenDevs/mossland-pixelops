import Phaser from 'phaser';

/**
 * Bidirectional event bus for Phaser ↔ React communication.
 *
 * Phaser → React: 'entity-clicked', 'world-stats-updated'
 * React → Phaser: 'camera-follow', 'debug-toggle'
 */
export const EventBus = new Phaser.Events.EventEmitter();
