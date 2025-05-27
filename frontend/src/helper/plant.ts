import type { ModelSensorConfig } from '@/types/device.ts';

export function plantFieldWithDataToStrings (
  defs: ModelSensorConfig[],
  devicePlantSlot: number,
  data: Record<string, unknown> | undefined,
): string[] {
  const lines: string[] = [];

  defs.forEach(def => {
    // Sicherer Zugriff mit optional chaining
    let line = `${def.fieldName}: `;
    if (data === undefined) {
      line += 'unknown';
      lines.push(line);
      return;
    }

    // Überspringen, wenn der Sensor für eine andere Pflanze konfiguriert ist
    if (def.type === 'plant' && def.plantSlot !== devicePlantSlot) {
      return;
    }

    const fieldValue = data[def.fieldName];

    // Prüfen, ob der Wert existiert und ein String ist
    if (typeof fieldValue === 'string') {
      line += fieldValue;
      line += resolveUnitToString(def.unit);
    } else if (fieldValue === undefined || fieldValue === null) {
      // Optional: Was tun, wenn der Wert nicht existiert oder null ist?
      // Z.B. einen leeren String setzen oder gar nicht erst hinzufügen
      line += 'unknown';
    } else {
      line += String(fieldValue);
      line += resolveUnitToString(def.unit);
    }

    lines.push(line);
  });

  return lines;
}

function resolveUnitToString (unit: string): string {
  switch (unit) {
    case 'percent':
      return '%';
    case 'celsius':
      return '°C';
    default:
      return '';
  }
}
