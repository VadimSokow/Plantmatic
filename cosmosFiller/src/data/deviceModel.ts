export type DeviceModel = {
    id: string
    name: string
    slotCount: number
    sensors: {
        [key: string]: {
            name: string
            fieldName: string
            description: string
            slot: number
            type: string
            unit: string
            accuracy: number
            min: number
            max: number
        }
    }
}

export const deviceModels: DeviceModel[] = [
    {
        id: "model-4-plants",
        name: "SmartGrow Hub 4-Slot",
        slotCount: 4,
        sensors: {
            "slot1_temperature": {
                name: "Temperature Sensor Slot 1",
                fieldName: "temperature",
                description: "Ambient air temperature for slot 1",
                slot: 1,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.5,
                min: 0,
                max: 50
            },
            "slot1_humidity": {
                name: "Humidity Sensor Slot 1",
                fieldName: "humidity",
                description: "Ambient air humidity for slot 1",
                slot: 1,
                type: "humidity",
                unit: "percent",
                accuracy: 2,
                min: 0,
                max: 100
            },
            "slot1_soilMoisture": {
                name: "Soil Moisture Sensor Slot 1",
                fieldName: "soilMoisture",
                description: "Soil moisture level for plant in slot 1",
                slot: 1,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 3,
                min: 0,
                max: 100
            },
            "slot1_light": {
                name: "Light Sensor Slot 1",
                fieldName: "light",
                description: "Light intensity for plant in slot 1",
                slot: 1,
                type: "light",
                unit: "lux",
                accuracy: 10,
                min: 0,
                max: 60000
            },
            "slot2_temperature": {
                name: "Temperature Sensor Slot 2",
                fieldName: "temperature",
                description: "Ambient air temperature for slot 2",
                slot: 2,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.5,
                min: 0,
                max: 50
            },
            "slot2_humidity": {
                name: "Humidity Sensor Slot 2",
                fieldName: "humidity",
                description: "Ambient air humidity for slot 2",
                slot: 2,
                type: "humidity",
                unit: "percent",
                accuracy: 2,
                min: 0,
                max: 100
            },
            "slot2_soilMoisture": {
                name: "Soil Moisture Sensor Slot 2",
                fieldName: "soilMoisture",
                description: "Soil moisture level for plant in slot 2",
                slot: 2,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 3,
                min: 0,
                max: 100
            },
            "slot2_light": {
                name: "Light Sensor Slot 2",
                fieldName: "light",
                description: "Light intensity for plant in slot 2",
                slot: 2,
                type: "light",
                unit: "lux",
                accuracy: 10,
                min: 0,
                max: 60000
            },
            "slot3_temperature": {
                name: "Temperature Sensor Slot 3",
                fieldName: "temperature",
                description: "Ambient air temperature for slot 3",
                slot: 3,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.5,
                min: 0,
                max: 50
            },
            "slot3_humidity": {
                name: "Humidity Sensor Slot 3",
                fieldName: "humidity",
                description: "Ambient air humidity for slot 3",
                slot: 3,
                type: "humidity",
                unit: "percent",
                accuracy: 2,
                min: 0,
                max: 100
            },
            "slot3_soilMoisture": {
                name: "Soil Moisture Sensor Slot 3",
                fieldName: "soilMoisture",
                description: "Soil moisture level for plant in slot 3",
                slot: 3,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 3,
                min: 0,
                max: 100
            },
            "slot3_light": {
                name: "Light Sensor Slot 3",
                fieldName: "light",
                description: "Light intensity for plant in slot 3",
                slot: 3,
                type: "light",
                unit: "lux",
                accuracy: 10,
                min: 0,
                max: 60000
            },
            "slot4_temperature": {
                name: "Temperature Sensor Slot 4",
                fieldName: "temperature",
                description: "Ambient air temperature for slot 4",
                slot: 4,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.5,
                min: 0,
                max: 50
            },
            "slot4_humidity": {
                name: "Humidity Sensor Slot 4",
                fieldName: "humidity",
                description: "Ambient air humidity for slot 4",
                slot: 4,
                type: "humidity",
                unit: "percent",
                accuracy: 2,
                min: 0,
                max: 100
            },
            "slot4_soilMoisture": {
                name: "Soil Moisture Sensor Slot 4",
                fieldName: "soilMoisture",
                description: "Soil moisture level for plant in slot 4",
                slot: 4,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 3,
                min: 0,
                max: 100
            },
            "slot4_light": {
                name: "Light Sensor Slot 4",
                fieldName: "light",
                description: "Light intensity for plant in slot 4",
                slot: 4,
                type: "light",
                unit: "lux",
                accuracy: 10,
                min: 0,
                max: 60000
            }
        }
    },
    {
        id: "model-2-plants",
        name: "CompactGrow Duo",
        slotCount: 2,
        sensors: {
            "slot1_temperature": {
                name: "Temperature Sensor Slot 1",
                fieldName: "temperature",
                description: "Air temperature for slot 1",
                slot: 1,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.7,
                min: -5,
                max: 45
            },
            "slot1_soilMoisture": {
                name: "Soil Moisture Sensor Slot 1",
                fieldName: "soilMoisture",
                description: "Soil moisture level for slot 1",
                slot: 1,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 4,
                min: 0,
                max: 100
            },
            "slot1_light": {
                name: "Light Sensor Slot 1",
                fieldName: "light",
                description: "Light intensity for slot 1",
                slot: 1,
                type: "light",
                unit: "lux",
                accuracy: 15,
                min: 0,
                max: 50000
            },
            "slot2_temperature": {
                name: "Temperature Sensor Slot 2",
                fieldName: "temperature",
                description: "Air temperature for slot 2",
                slot: 2,
                type: "temperature",
                unit: "celsius",
                accuracy: 0.7,
                min: -5,
                max: 45
            },
            "slot2_soilMoisture": {
                name: "Soil Moisture Sensor Slot 2",
                fieldName: "soilMoisture",
                description: "Soil moisture level for slot 2",
                slot: 2,
                type: "soil-moisture",
                unit: "percent",
                accuracy: 4,
                min: 0,
                max: 100
            },
            "slot2_light": {
                name: "Light Sensor Slot 2",
                fieldName: "light",
                description: "Light intensity for slot 2",
                slot: 2,
                type: "light",
                unit: "lux",
                accuracy: 15,
                min: 0,
                max: 50000
            }
        }
    }
];