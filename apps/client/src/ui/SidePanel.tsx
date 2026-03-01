import { useWorldStore } from '../store/worldStore';
import { EventBus } from '../game/EventBus';

export function SidePanel() {
  const selectedEntity = useWorldStore((s) => s.selectedEntity);
  const eventLog = useWorldStore((s) => s.eventLog);
  const agents = useWorldStore((s) => s.agents);
  const buildings = useWorldStore((s) => s.buildings);

  // Get entity-specific event history
  const entityHistory = selectedEntity
    ? eventLog.filter((e) => {
        if (selectedEntity.type === 'agent') {
          const agent = agents[selectedEntity.id];
          return agent?.eventHistory.includes(e.eventId);
        }
        const building = buildings[selectedEntity.id];
        return building?.eventHistory.includes(e.eventId);
      })
    : [];

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h2>PixelOps</h2>
        <div className="entity-counts">
          <span>{Object.keys(agents).length} agents</span>
          <span>{Object.keys(buildings).length} buildings</span>
        </div>
      </div>

      {selectedEntity ? (
        <div className="entity-detail">
          <div className="entity-title">
            <span className={`entity-badge ${selectedEntity.type}`}>
              {selectedEntity.type === 'agent' ? '\u{1F9D1}' : '\u{1F3E2}'}
            </span>
            <h3>{selectedEntity.name}</h3>
          </div>
          <div className="entity-meta">
            <div><strong>ID:</strong> {selectedEntity.id}</div>
            <div><strong>District:</strong> {selectedEntity.districtId}</div>
            <div><strong>State:</strong> <span className={`state-${selectedEntity.state}`}>{selectedEntity.state}</span></div>
            <div><strong>Position:</strong> ({selectedEntity.tileX}, {selectedEntity.tileY})</div>
          </div>
          <button
            className="follow-btn"
            onClick={() => EventBus.emit('camera-follow', selectedEntity.id)}
          >
            Follow
          </button>
          <button
            className="close-btn"
            onClick={() => useWorldStore.getState().selectEntity(null)}
          >
            Close
          </button>

          {entityHistory.length > 0 && (
            <div className="event-history">
              <h4>Event History</h4>
              {entityHistory.slice(0, 10).map((e) => (
                <div key={e.eventId} className="event-item">
                  <div className="event-time">{new Date(e.ts).toLocaleTimeString()}</div>
                  <div className="event-summary">{e.summary}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="no-selection">
          <p>Click an agent or building to see details</p>
        </div>
      )}

      <div className="global-events">
        <h4>Recent Events ({eventLog.length})</h4>
        <div className="event-list">
          {eventLog.slice(0, 15).map((e) => (
            <div key={e.eventId} className={`event-item source-${e.source}`}>
              <div className="event-time">{new Date(e.ts).toLocaleTimeString()}</div>
              <div className="event-summary">{e.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
