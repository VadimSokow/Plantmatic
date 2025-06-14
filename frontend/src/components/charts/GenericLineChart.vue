<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
  import type { DeviceModelSensorConfig } from '@/types/device.ts'
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
  import { resolveUnitToString, sensorTypeToString } from '@/helper/plant.ts'
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

  const props = defineProps<{
    data: MeasuredPlant
    sensor: DeviceModelSensorConfig
  }>()

  const chartData = computed<ChartData<'line'>>(() => {
    console.log('data:', props.data)
    const points = props.data.values.map(m => ({
      x: m.timestamp.getTime(),
      y: m.value,
    }))
    console.log('Chart data points:', points)

    return {
      labels: points.map(p => p.x),
      datasets: [
        {
          label: `${props.sensor.name} (${resolveUnitToString(props.sensor.unit)})`,
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
          unit: 'minute',
          minUnit: 'minute',
          tooltipFormat: 'dd.MM.yyyy HH:mm:ss',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'dd.MM HH:mm',
            day: 'dd.MM',
            week: 'dd.MM.yy',
            month: 'MMM',
            quarter: '[Q]Q',
            year: 'yyyy',
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
          text: `${sensorTypeToString(props.sensor.type)} (${resolveUnitToString(props.sensor.unit)})`,
        },
      },
    },
  }))

</script>
