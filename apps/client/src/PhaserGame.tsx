import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/main';
import { EventBus } from './game/EventBus';

interface Props {
  onToggleDebug: () => void;
}

export function PhaserGame({ onToggleDebug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    };

    gameRef.current = new Phaser.Game(config);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') onToggleDebug();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      gameRef.current?.destroy(true);
      gameRef.current = null;
      EventBus.removeAllListeners();
    };
  }, [onToggleDebug]);

  // Resize game on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !gameRef.current) return;
      gameRef.current.scale.resize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
    />
  );
}
