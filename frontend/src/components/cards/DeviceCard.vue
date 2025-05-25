<template>
  <v-card v-if="device" class="device-card" :to="`/devices/${deviceId}`" variant="outlined">
    <v-card-title class="text-h5">{{ device.name }}</v-card-title>
    <v-card-subtitle>Geräte ID: {{ deviceId }}</v-card-subtitle>
    <v-card-text>
      <p>Standort: {{ device.location }}</p>
      <p>Slots: {{ plantNames.length }} / {{ deviceModel?.slot_count }}</p>
      <div v-if="plantNames.length > 0" class="plants-section">
        <p class="text-subtitle-1">Pflanzen:</p>
        <ul class="plant-list">
          <li v-for="(plantName, index) in plantNames" :key="index">
            {{ plantName }}
          </li>
        </ul>
      </div>
      <div v-else class="plants-section">
        <p class="text-subtitle-1">Pflanzen:</p>
        <p>Keine Pflanzen zugewiesen.</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { usePlantStore } from '@/stores/plants.ts';
  import { useDeviceModelStore } from '@/stores/deviceModels.ts';
  import { useDeviceStore } from '@/stores/devices.ts';
  import type { Device, DeviceModel } from '@/types/device.ts';

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
  });

  const plantStore = usePlantStore();
  const deviceStore = useDeviceStore();
  const deviceModelStore = useDeviceModelStore();

  const device = ref<Device | undefined>(undefined);
  const deviceModel = ref<DeviceModel | undefined>(undefined);

  const plantNames = computed(() => {
    if (!device.value) return [];
    return device.value.plantSlots.map(slot => {
      if (!slot.plantId) return null;
      const plant = plantStore.getPlantById(slot.plantId);
      return plant ? plant.name : null;
    });
  });

  onMounted(() => {
    device.value = deviceStore.getDeviceById(props.deviceId);
    if (device.value) {
      deviceModelStore.fetchDeviceModel(device.value.modelId).then(data => {
        if (data) {
          deviceModel.value = data;
        }
      })
    }
  });
</script>

<style scoped>
.device-card {
  margin-bottom: 16px;
  max-width: 400px;
}

.plant-list {
  padding-left: 24px;
  margin-left: 0;
}

.plant-list li {
  margin-bottom: 4px;
}

.plants-section {
  margin-top: 16px;
}
</style>
