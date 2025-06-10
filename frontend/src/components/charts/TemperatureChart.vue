<template>
  <div>
    <line-chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  import 'chartjs-adapter-date-fns'

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    TimeScale,
    PointElement,
    CategoryScale,
  )

  export default {
    name: 'TemperatureChart',
    components: {
      LineChart: Line,
    },
    data () {
      return {
        // Zufällige X-Y-Daten generieren
        dataPoints: this.generateRandomData(),
      }
    },
    computed: {
      chartData () {
        return {
          labels: this.dataPoints.map(dp => dp.time),
          datasets: [
            {
              label: 'Temperatur (°C)',
              data: this.dataPoints.map(dp => dp.value),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.2,
            },
          ],
        }
      },
      chartOptions () {
        return {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                // Zeige lesbare Zeitstempel im Tooltip
                title: tooltipItems => {
                  const item = tooltipItems[0]
                  return new Date(item.label).toLocaleTimeString()
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'second', // Skalierung für die Anzeige z.B. Sekunden
                displayFormats: {
                  second: 'mm:ss',
                  minute: 'hh:mm:ss',
                },
              },
              title: {
                display: true,
                text: 'Zeit',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperatur (°C)',
              },
            },
          },
        }
      },
    },
    methods: {
      generateRandomData () {
        const data = []
        const startTime = Date.now()

        // Generiere 10 zufällige Datenpunkte mit unregelmäßigen Zeitabständen
        for (let i = 0; i < 10; i++) {
          const randomGap = Math.floor(Math.random() * 5000) + 1000 // Lücke: 1000 ms bis 5000 ms
          const time = startTime + randomGap * i // Unregelmäßige Zeitabstände
          const value = Math.random() * 20 + 10 // Temperatur: 10°C - 30°C
          data.push({ time, value })
        }

        // sort by first value
        data.sort((a, b) => a.time - b.time)

        return data
      },
    },
  }
</script>

<style scoped>
/* Optional: Custom Styles */
</style>
