import type { PixelOpsEvent } from '@pixelops/events';
import { EVENT_TEMPLATES, getRandomPayloadName } from './eventTemplates';
import { useWorldStore } from '../store/worldStore';

let intervalId: ReturnType<typeof setInterval> | null = null;
let eventCounter = 0;

function generateEvent(): PixelOpsEvent {
  const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]!;
  const name = getRandomPayloadName(template);

  eventCounter++;
  const id = crypto.randomUUID();

  return {
    id,
    ts: new Date().toISOString(),
    source: template.source,
    type: template.type,
    entity: {
      kind: template.entityKind,
      id: `${template.entityKind}-${eventCounter}`,
      name,
    },
    payload: {
      district: template.districtId,
      generated: true,
      sequence: eventCounter,
    },
    provenance: {
      url: `https://mock.pixelops.dev/events/${id}`,
      label: template.provenanceLabel,
    },
  };
}

export function startMockEvents() {
  stopMockEvents();

  const tick = () => {
    const { mockConfig, processEvent } = useWorldStore.getState();
    if (mockConfig.paused) return;

    processEvent(generateEvent());
  };

  // Initial interval based on store speed
  updateInterval();

  // Subscribe to speed changes
  useWorldStore.subscribe((state, prevState) => {
    if (state.mockConfig.speed !== prevState.mockConfig.speed) {
      updateInterval();
    }
  });
}

function updateInterval() {
  if (intervalId !== null) clearInterval(intervalId);
  const speed = useWorldStore.getState().mockConfig.speed;
  if (speed <= 0) return;

  const ms = 1000 / speed;
  intervalId = setInterval(() => {
    const { mockConfig, processEvent } = useWorldStore.getState();
    if (!mockConfig.paused) {
      processEvent(generateEvent());
    }
  }, ms);
}

export function stopMockEvents() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
