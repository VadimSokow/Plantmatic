<template>
  <v-container>
    <h1>{{ plant.name }}</h1>
    <p>Details für Pflanze mit ID: {{ id }}</p>

    <MeasuredLineChart
      v-if="measurementSoil"
      :title="'Bodenfeuchte an der Pflanze'"
      :data="measurementSoil.values"
      :datasetLabel="'Bodenfeuchte (%)'"
      :backgroundColor="'#2196F3'"
      :borderColor="'#2196F3'"
      :xAxisLabel="'Zeit'"
      :yAxisLabel="'Bodenfeuchte'"
    />
    <v-spacer />
    <MeasuredLineChart
      v-if="measurementTemp"
      :title="'Temperatur an der Pflanze'"
      :data="measurementTemp.values"
      :datasetLabel="'Temperatur (°C)'"
      :backgroundColor="'#2196F3'"
      :borderColor="'#2196F3'"
      :xAxisLabel="'Zeit'"
      :yAxisLabel="'Temperatur'"
    />
    <p v-else> Keine Daten Gefunden! </p>
  </v-container>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {type DeviceMeasurement, type PlantMeasurement, useMeasurementsStore} from "@/stores/measurements.ts";

const route = useRoute('/plants/[id]');
const id = ref<string>(route.params.id);
const plant = ref<{ name: string; details: string }>({name: '', details: ''});

const measurementStore = useMeasurementsStore();

const measurementSoil = ref<PlantMeasurement | undefined>(undefined);
const measurementTemp = ref<DeviceMeasurement | undefined>(undefined);

onMounted(() => {
  // Hier würdest du die Details für die Pflanze mit der ID vom Backend abrufen
  console.log('Abrufen der Details für Pflanze:', id.value);
  // Beispiel-Daten:
  plant.value = {name: `Pflanze ${id.value}`, details: 'Weitere Informationen...'};

  measurementStore.load().then(() => {
    measurementSoil.value = measurementStore.getPlantMeasurements(id.value, 'soil_moisture_basic');
    measurementTemp.value = measurementStore.getDeviceMeasurements('1', 'temp1');
  });
});
</script>
