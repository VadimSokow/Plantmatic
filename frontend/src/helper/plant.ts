import type { DeviceModelSensorConfig } from '@/types/device.ts'

export function plantFieldWithDataToStrings (
  defs: Record<string, DeviceModelSensorConfig>,
  devicePlantSlot: number,
  data: Record<string, unknown> | undefined,
): string[] {
  console.log('defs', defs)
  const lines: string[] = []

  for (const def of Object.values(defs)) {
    // Sicherer Zugriff mit optional chaining
    let line = `${def.name}: `
    if (data === undefined) {
      line += 'unknown'
      lines.push(line)
      continue
    }

    // Überspringen, wenn der Sensor für eine andere Pflanze konfiguriert ist
    if (def.type === 'plant' && def.plantSlot !== devicePlantSlot) {
      continue
    }

    const fieldValue = data[def.fieldName]

    // Prüfen, ob der Wert existiert und ein String ist
    if (typeof fieldValue === 'string') {
      line += fieldValue
      line += resolveUnitToString(def.unit)
    } else if (fieldValue === undefined || fieldValue === null) {
      // Optional: Was tun, wenn der Wert nicht existiert oder null ist?
      // Z.B. einen leeren String setzen oder gar nicht erst hinzufügen
      line += 'unknown'
    } else {
      line += String(fieldValue)
      line += resolveUnitToString(def.unit)
    }

    lines.push(line)
  }

  return lines
}

function resolveUnitToString (unit: string): string {
  switch (unit) {
    case 'percent': {
      return '%'
    }
    case 'celsius': {
      return '°C'
    }
    case 'lux': {
      return 'lx'
    }
    default: {
      return ''
    }
  }
}
