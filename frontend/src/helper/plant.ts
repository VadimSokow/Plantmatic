import type { DeviceModelSensorConfig } from '@/types/device.ts'

export function plantFieldWithDataToStrings (
  defs: Record<string, DeviceModelSensorConfig>,
  devicePlantSlot: number,
  data: Record<string, unknown> | undefined,
): string[] {
  const lines: string[] = []

  for (const def of Object.values(defs)) {
    // Sicherer Zugriff mit optional chaining
    let line = `${def.name}: `
    if (data === undefined) {
      line += 'unknown'
      lines.push(line)
      continue
    }

    console.log(`${def.slot} !== ${devicePlantSlot}`)

    // Überspringen, wenn der Sensor für eine andere Pflanze konfiguriert ist
    if (def.slot !== devicePlantSlot) {
      continue
    }

    const fieldValue = data[def.fieldName]
    // Prüfen, ob der Wert existiert und ein String ist
    if (typeof fieldValue === 'string') {
      line += fieldValue
      line += resolveUnitToString(def.unit)
    } else if (fieldValue === undefined || fieldValue === null) {
      line += 'unknown'
    } else {
      line += String(fieldValue)
      line += resolveUnitToString(def.unit)
    }

    lines.push(line)
  }

  return lines
}

export function resolveUnitToString (unit: string): string {
  switch (unit.toLowerCase()) {
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

export function sensorTypeToString (type: string): string {
  // replace - to space and capitalize first letters after space
  return type
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
