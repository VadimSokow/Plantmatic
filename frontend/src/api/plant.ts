export const fetchPlants = async () => {
  return {
    plants: [
      {
        id: '1',
        name: 'Plant 1',
        lastMeasurement: {
          temperature: 22,
          humidity: 50,
          soilMoisture: 30,
          light: 200,
          timestamp: Date.now(),
        },
      },
      {
        id: '2',
        name: 'Plant 2',
        lastMeasurement: {
          temperature: 24,
          humidity: 55,
          soilMoisture: 35,
          light: 220,
          timestamp: Date.now(),
        },
      },
    ],
  }
}

export const fetchPlant = async (id: string) => {
  return {
    id,
    name: `Plant ${id}`,
    lastMeasurement: {
      temperature: 22,
      humidity: 50,
      soilMoisture: 30,
      light: 200,
      timestamp: Date.now(),
    },
  }
}
