<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

type MeasuredValues = {
  timestamp: number; // Unix-Timestamp in MILLISEKUNDEN
  value: number;
}[];

interface LineChartProps {
  title?: string;
  data: MeasuredValues;
  datasetLabel: string;
  backgroundColor?: string;
  borderColor?: string;
  tension?: number;
  fill?: boolean | string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const props = withDefaults(defineProps<LineChartProps>(), {
  title: 'Mein Liniendiagramm',
  backgroundColor: '#42A5F5',
  borderColor: '#42A5F5',
  tension: 0.1,
  fill: false,
  xAxisLabel: 'Zeitpunkt',
  yAxisLabel: 'Wert',
});

const chartData = computed<ChartData<"line">>(() => {
  const labels = props.data.map(item => {
    const date = new Date(item.timestamp);
    // Hier formatieren wir Datum und Uhrzeit
    return date.toLocaleString('de-DE', {
      year: 'numeric',   // 4-stellige Jahreszahl (z.B. 2023)
      month: '2-digit',  // 2-stelliger Monat (z.B. 01 für Januar)
      day: '2-digit',    // 2-stelliger Tag (z.B. 09)
      hour: '2-digit',   // 2-stellige Stunde (z.B. 08)
      minute: '2-digit', // 2-stellige Minute (z.B. 05)
      // second: '2-digit', // Optional: Wenn Sekunden auch wichtig sind
    });
  });

  const values = props.data.map(item => item.value);

  return {
    labels: labels,
    datasets: [
      {
        label: props.datasetLabel,
        backgroundColor: props.backgroundColor,
        borderColor: props.borderColor,
        data: values,
        tension: props.tension,
        fill: props.fill,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: props.xAxisLabel,
      },
    },
    y: {
      title: {
        display: true,
        text: props.yAxisLabel,
      },
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: false,
    },
  },
}));
</script>
