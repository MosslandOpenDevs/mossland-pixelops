import { useEffect, useState, useCallback } from 'react';
import { PhaserGame } from './PhaserGame';
import { SidePanel } from './ui/SidePanel';
import { DebugOverlay } from './ui/DebugOverlay';
import { MockControls } from './ui/MockControls';
import { ThemeSelector } from './ui/ThemeSelector';
import { EventBus } from './game/EventBus';
import { useWorldStore } from './store/worldStore';

export function App() {
  const [debugVisible, setDebugVisible] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const handler = (entity: {
      type: 'agent' | 'building';
      id: string;
      name: string;
      districtId: string;
      state: string;
      tileX: number;
      tileY: number;
    }) => {
      useWorldStore.getState().selectEntity(entity);
    };
    EventBus.on('entity-clicked', handler);
    return () => {
      EventBus.off('entity-clicked', handler);
    };
  }, []);

  // Reload Phaser game when map changes
  const handleMapChange = useCallback((_mapId: string) => {
    setGameKey((k) => k + 1);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <PhaserGame key={gameKey} onToggleDebug={() => setDebugVisible((v) => !v)} />
        <div className="vignette-overlay" />
        {debugVisible && <DebugOverlay />}
        <MockControls />
        <ThemeSelector onMapChange={handleMapChange} />
      </div>
      <SidePanel />
    </div>
  );
}
