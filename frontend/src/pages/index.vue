<template>
  <v-container>
    <v-row>
      <v-col v-for="device in devices.values()" :key="device.id" cols="12" md="4">
        <DeviceCard :device-id="device.id" />
      </v-col>
    </v-row>

    <LoadAndError
      :error="deviceStore.error"
      :is-loading="deviceStore.isLoading"
      @error-cleared="deviceStore.$patch({ error: null })"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { onMounted } from 'vue';
  import { useDeviceStore } from '@/stores/devices.ts';
  import { usePlantStore } from '@/stores/plants.ts';

  const deviceStore = useDeviceStore();
  const { devices } = storeToRefs(deviceStore);

  const plantStore = usePlantStore();

  onMounted(() => {
    deviceStore.fetchDevices().then(() => {
      const plant_ids = deviceStore.getAllPlantIds
      plantStore.fetchPlants(plant_ids);
    });
  });
</script>
