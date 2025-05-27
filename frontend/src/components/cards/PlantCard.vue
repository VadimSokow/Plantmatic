<template>
  <v-card v-if="plant && plantType" :to="`/plants/${props.plantId}`" variant="outlined">
    <v-card-title>
      <v-icon icon="mdi-leaf" />
      {{ plant.name }}
    </v-card-title>
    <v-card-text>
      <p>Art: {{ plantType.commonName }}</p>
      <div v-for="line in fields" :key="line">
        <p>{{ line }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { type Plant, type PlantType } from '@/types/plant.ts';
  import { type DeviceModel } from '@/types/device.ts';
  import { usePlantStore } from '@/stores/plants.ts';
  import { ref } from 'vue';
  import { usePlantTypesStore } from '@/stores/plantTypes.ts';
  import { plantFieldWithDataToStrings } from '@/helper/plant.ts';
  import { useDeviceModelStore } from '@/stores/deviceModels.ts';

  const plantStore = usePlantStore();
  const plantTypeStore = usePlantTypesStore();
  const deviceModelStore = useDeviceModelStore();

  const plant = ref<Plant | null>(null);
  const plantType = ref<PlantType | null>(null);
  const deviceModel = ref<DeviceModel | null>(null);

  onMounted(() => {
    plantStore.resolvePlant(props.plantId).then(data => {
      if (!data) return;
      plant.value = data;
      plantTypeStore.fetchPlantType(data.plantTypeId).then(type => {
        if (!type) return;
        plantType.value = type;
      })
    }).catch(error => {
      console.error('Error fetching plant:', error);
    });
    deviceModelStore.fetchDeviceModel(props.deviceModelId).then(data => {
      if (data) {
        deviceModel.value = data;
      }
    })
  })

  const props = defineProps({
    plantId: {
      type: String,
      required: true,
    },
    devicePlantSlot: {
      type: Number,
      required: true,
    },
    deviceModelId: {
      type: String,
      required: true,
    },
  });

  const fields = computed(() => {
    if (!plant.value || !deviceModel.value) return [];
    return plantFieldWithDataToStrings(deviceModel.value.sensors, props.devicePlantSlot, plant.value.currentSensorData);
  });
</script>
