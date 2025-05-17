<template>
  <v-container>
    <v-row>
      <v-col v-for="device in devices" :key="device.id" cols="12" md="4">
        <DeviceCard
          :connection="device.connection_state"
          :device-id="device.id"
          :location="device.location"
          :name="device.name"
          :plant-ids="device.plant_ids"
        />
      </v-col>
    </v-row>

    <v-overlay
      class="align-center justify-center"
      :model-value="isLoading"
      persistent
      scrim="black"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>

    <v-dialog
      v-model="showError"
      persistent
      width="auto"
    >
      <v-card>
        <v-card-text>
          {{ error }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="clearError"
          >
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { onMounted } from 'vue';
  import { useDeviceStore } from '@/stores/devices.ts';
  import { usePlantStore } from '@/stores/plants.ts';

  const deviceStore = useDeviceStore();
  const { devices, isLoading, error } = storeToRefs(deviceStore);

  const plantStore = usePlantStore();

  const clearErrorPressed = ref(false);
  const showError = computed(() => error.value != null && !clearErrorPressed.value);

  const clearError = () => {
    clearErrorPressed.value = true;
    setTimeout(() => {
      deviceStore.$patch({ error: null });
      clearErrorPressed.value = false;
    }, 300);
  };

  onMounted(() => {
    deviceStore.fetchDevices().then(() => {
      const plant_ids = deviceStore.getAllPlantIds
      plantStore.fetchPlants(plant_ids);
    });
  });
</script>
