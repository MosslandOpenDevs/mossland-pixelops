export interface MapConfig {
  id: string;
  label: string;
  type: 'tiled' | 'image';
  /** For tiled maps: path to Tiled JSON */
  jsonPath?: string;
  /** For image maps: path to background PNG */
  imagePath?: string;
  /** For image maps: path to collision JSON */
  collisionPath?: string;
  /** Tileset definitions (tiled maps only) */
  tilesets?: Array<{ tiledName: string; key: string; path: string }>;
  tileSize: number;
  defaultZoom: number;
}

export const MAPS: MapConfig[] = [
  {
    id: 'the-ville',
    label: 'The Ville (Generative Agents)',
    type: 'tiled',
    jsonPath: 'assets/ga/the_ville.json',
    tileSize: 32,
    defaultZoom: 1.5,
    tilesets: [
      { tiledName: 'blocks', key: 'blocks_1', path: 'assets/ga/tilesets/blocks_1.png' },
      { tiledName: 'Room_Builder_32x32', key: 'walls', path: 'assets/ga/tilesets/Room_Builder_32x32.png' },
      { tiledName: 'interiors_pt1', key: 'interiors_pt1', path: 'assets/ga/tilesets/interiors_pt1.png' },
      { tiledName: 'interiors_pt2', key: 'interiors_pt2', path: 'assets/ga/tilesets/interiors_pt2.png' },
      { tiledName: 'interiors_pt3', key: 'interiors_pt3', path: 'assets/ga/tilesets/interiors_pt3.png' },
      { tiledName: 'interiors_pt4', key: 'interiors_pt4', path: 'assets/ga/tilesets/interiors_pt4.png' },
      { tiledName: 'interiors_pt5', key: 'interiors_pt5', path: 'assets/ga/tilesets/interiors_pt5.png' },
      { tiledName: 'CuteRPG_Field_B', key: 'CuteRPG_Field_B', path: 'assets/ga/tilesets/CuteRPG_Field_B.png' },
      { tiledName: 'CuteRPG_Field_C', key: 'CuteRPG_Field_C', path: 'assets/ga/tilesets/CuteRPG_Field_C.png' },
      { tiledName: 'CuteRPG_Harbor_C', key: 'CuteRPG_Harbor_C', path: 'assets/ga/tilesets/CuteRPG_Harbor_C.png' },
      { tiledName: 'CuteRPG_Village_B', key: 'CuteRPG_Village_B', path: 'assets/ga/tilesets/CuteRPG_Village_B.png' },
      { tiledName: 'CuteRPG_Forest_B', key: 'CuteRPG_Forest_B', path: 'assets/ga/tilesets/CuteRPG_Forest_B.png' },
      { tiledName: 'CuteRPG_Desert_C', key: 'CuteRPG_Desert_C', path: 'assets/ga/tilesets/CuteRPG_Desert_C.png' },
      { tiledName: 'CuteRPG_Mountains_B', key: 'CuteRPG_Mountains_B', path: 'assets/ga/tilesets/CuteRPG_Mountains_B.png' },
      { tiledName: 'CuteRPG_Desert_B', key: 'CuteRPG_Desert_B', path: 'assets/ga/tilesets/CuteRPG_Desert_B.png' },
      { tiledName: 'CuteRPG_Forest_C', key: 'CuteRPG_Forest_C', path: 'assets/ga/tilesets/CuteRPG_Forest_C.png' },
    ],
  },
  {
    id: 'office-level3',
    label: 'Office Level 3',
    type: 'image',
    imagePath: 'assets/office/office_level3.png',
    collisionPath: 'assets/office/office_level3_collision.json',
    tileSize: 16,
    defaultZoom: 3,
  },
  {
    id: 'office-level2',
    label: 'Office Level 2',
    type: 'image',
    imagePath: 'assets/office/office_level2.png',
    collisionPath: 'assets/office/office_level2_collision.json',
    tileSize: 16,
    defaultZoom: 3,
  },
];

let currentMapId = 'the-ville';

export function setCurrentMap(id: string) { currentMapId = id; }
export function getCurrentMap(): MapConfig {
  return MAPS.find((m) => m.id === currentMapId) ?? MAPS[0]!;
}
