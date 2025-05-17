<template>
  <apexchart :options="chartOptions" :series="series" type="line" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  // Props, um die Daten und Optionen von außen zu konfigurieren
  const props = defineProps({
    chartData: {
      type: Array<number>,
      required: true,
    },
    chartLabels: {
      type: Array<string>,
      default: () => [],
    },
    chartTitle: {
      type: String,
      default: 'Liniendiagramm',
    },
    yAxisTitle: {
      type: String,
      default: 'Wert',
    },
    xAxisTitle: {
      type: String,
      default: 'Zeit',
    },
  });

  // Reaktive Variablen für die Chart-Optionen und Daten
  const chartOptions = ref({
    chart: {
      id: 'line-chart',
      toolbar: {
        show: false,
      },
      width: 600,
      height: 400,
    },
    title: {
      text: props.chartTitle,
      align: 'left',
      style: { // Optional: Titel auch im dunklen Stil halten
        color: 'rgba(255, 255, 255, 0.87)', // Vuetify's primäre Textfarbe im Dark Theme
      },
    },
    xaxis: {
      categories: props.chartLabels,
      title: {
        text: props.xAxisTitle,
        style: {
          color: 'rgba(255, 255, 255, 0.6)', // Etwas hellere Textfarbe für Achsentitel
        },
      },
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.6)', // Farbe der X-Achsen-Beschriftungen
        },
      },
    },
    yaxis: {
      title: {
        text: props.yAxisTitle,
        style: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark', // Setze das Tooltip-Theme auf 'dark'
      style: { // Optional: Weitere Anpassungen des Tooltip-Stils
        fontSize: '12px',
        fontFamily: undefined,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dunkler Hintergrund für das Popup
        color: '#fff', // Weiße Textfarbe im Popup
      },
    },
  });

  const series = ref([
    {
      name: 'Daten',
      data: props.chartData,
    },
  ]);

  // Watcher, um die Serien-Daten zu aktualisieren, wenn sich die Props ändern
  watch(
    () => props.chartData,
    newChartData => {
      series.value = [
        {
          name: 'Daten',
          data: newChartData,
        },
      ];
    }
  );

  // Watcher, um die Labels der X-Achse zu aktualisieren
  watch(
    () => props.chartLabels,
    newChartLabels => {
      chartOptions.value.xaxis.categories = newChartLabels;
    }
  );

  // Watcher für den Titel
  watch(
    () => props.chartTitle,
    newChartTitle => {
      chartOptions.value.title.text = newChartTitle;
    }
  );

  // Watcher für den Y-Achsen-Titel
  watch(
    () => props.yAxisTitle,
    newYAxisTitle => {
      chartOptions.value.yaxis.title.text = newYAxisTitle;
    }
  );

  // Watcher für den X-Achsen-Titel
  watch(
    () => props.xAxisTitle,
    newXAxisTitle => {
      chartOptions.value.xaxis.title.text = newXAxisTitle;
    }
  );
</script>
