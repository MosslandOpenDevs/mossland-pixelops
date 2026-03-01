import { MAPS, getCurrentMap, setCurrentMap } from '../game/mapConfig';

interface Props {
  onMapChange: (mapId: string) => void;
}

export function ThemeSelector({ onMapChange }: Props) {
  const current = getCurrentMap();

  return (
    <div className="theme-selector">
      <label>Map:</label>
      <select
        value={current.id}
        onChange={(e) => {
          setCurrentMap(e.target.value);
          onMapChange(e.target.value);
        }}
      >
        {MAPS.map((m) => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
