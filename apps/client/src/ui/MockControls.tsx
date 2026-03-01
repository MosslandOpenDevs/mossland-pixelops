import { useWorldStore } from '../store/worldStore';

export function MockControls() {
  const speed = useWorldStore((s) => s.mockConfig.speed);
  const paused = useWorldStore((s) => s.mockConfig.paused);

  return (
    <div className="mock-controls">
      <button
        className={`pause-btn ${paused ? 'paused' : ''}`}
        onClick={() => useWorldStore.getState().setMockPaused(!paused)}
      >
        {paused ? '\u25B6' : '\u23F8'}
      </button>
      <div className="speed-control">
        <label>Speed: {speed.toFixed(1)} evt/s</label>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={speed}
          onChange={(e) => useWorldStore.getState().setMockSpeed(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
