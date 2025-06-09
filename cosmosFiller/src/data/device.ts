export type Device = {
    id: string
    name: string
    userId: string
    location: string
    modelId: string
    plantSlots: Array<{
        plantId: string
        slotNumber: number
    }>
    config: {
        [key: string]: any // Flexible config object, can be extended as needed
    }
}

export const devices: Device[] = [
    {
        id: "device-1",
        name: "Wohnzimmer SmartGrow",
        userId: "user",
        location: "Wohnzimmer",
        modelId: "model-4-plants",
        plantSlots: [
            {
                plantId: "plant-1",
                slotNumber: 1
            },
            {
                plantId: "plant-2",
                slotNumber: 2
            },
            {
                plantId: "plant-3",
                slotNumber: 3
            },
            {
                plantId: "plant-4",
                slotNumber: 4
            }
        ],
        config: {
            measuringInterval: 60
        }
    },
    {
        id: "device-2",
        name: "Küche Kräutergarten",
        userId: "user",
        location: "Küche",
        modelId: "model-4-plants",
        plantSlots: [
            {
                plantId: "plant-5",
                slotNumber: 1
            },
            {
                plantId: "plant-6",
                slotNumber: 2
            },
            {
                plantId: "plant-7",
                slotNumber: 3
            },
            {
                plantId: "plant-8",
                slotNumber: 4
            }
        ],
        config: {
            measuringInterval: 120
        }
    },
    {
        id: "device-3",
        name: "Badezimmer Oase",
        userId: "user",
        location: "Badezimmer",
        modelId: "model-2-plants",
        plantSlots: [
            {
                plantId: "plant-9",
                slotNumber: 1
            },
            {
                plantId: "plant-10",
                slotNumber: 2
            }
        ],
        config: {
            measuringInterval: 90
        }
    },
    {
        id: "device-4",
        name: "Schlafzimmer Grün",
        userId: "user",
        location: "Schlafzimmer",
        modelId: "model-2-plants",
        plantSlots: [
            {
                plantId: "plant-11",
                slotNumber: 1
            },
            {
                plantId: "plant-12",
                slotNumber: 2
            }
        ],
        config: {
            measuringInterval: 180
        }
    },
    {
        id: "device-5",
        name: "Büro Desktop",
        userId: "user",
        location: "Büro",
        modelId: "model-2-plants",
        plantSlots: [
            {
                plantId: "plant-13",
                slotNumber: 1
            },
            {
                plantId: "plant-14",
                slotNumber: 2
            }
        ],
        config: {
            measuringInterval: 45
        }
    },
    {
        id: "device-6",
        name: "Flur Begrünung",
        userId: "user",
        location: "Flur",
        modelId: "model-2-plants",
        plantSlots: [
            {
                plantId: "plant-15",
                slotNumber: 1
            },
            {
                plantId: "plant-16",
                slotNumber: 2
            }
        ],
        config: {
            measuringInterval: 75
        }
    }
];