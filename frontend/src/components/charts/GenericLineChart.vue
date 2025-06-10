<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
  import type { MeasuredPlant } from '@/types/measurement.ts'
  import {
    CategoryScale,
    type ChartData, Chart as ChartJS, type ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement, TimeScale,
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

  const props = defineProps<{ data: MeasuredPlant }>()

  const chartData = computed<ChartData<'line'>>(() => {
    // let current = Date.now()
    // const newTimeStamp = () => {
    //   const randomOffset = Math.ceil(Math.random() * 4)
    //   current += randomOffset * 1000
    //   return new Date(current)
    // }
    // const values = [1, 3, 4, 5, 7, 3, 2, -1, -3, -4]
    // const points = values.map(value => ({
    //   x: newTimeStamp().getTime(),
    //   y: value,
    // }))
    const points = props.data.values.map(m => ({
      x: new Date(m.timestamp).getTime(),
      y: m.value,
    }))

    return {
      labels: points.map(p => p.x),
      datasets: [
        {
          label: 'Temperatur (°C)',
          data: points.map(p => p.y),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2,
        },
      ],
    }
  })

  const chartOptions = computed<ChartOptions<'line'>>(() => ({
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
  }))

</script>
