import { useWorldStore } from '../store/worldStore';

export function DebugOverlay() {
  const fps = useWorldStore((s) => s.fps);
  const agentCount = useWorldStore((s) => Object.keys(s.agents).length);
  const buildingCount = useWorldStore((s) => Object.keys(s.buildings).length);
  const eventCount = useWorldStore((s) => s.eventLog.length);
  const tick = useWorldStore((s) => s.tick);

  return (
    <div className="debug-overlay">
      <div>FPS: {fps}</div>
      <div>Agents: {agentCount}</div>
      <div>Buildings: {buildingCount}</div>
      <div>Events: {eventCount}</div>
      <div>Tick: {tick}</div>
    </div>
  );
}
