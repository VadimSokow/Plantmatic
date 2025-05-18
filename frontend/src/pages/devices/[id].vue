<template>
  <v-row v-if="device != undefined">
    <!-- left panel - Device Info -->
    <v-col cols="auto">
      <DevicePanel
        :connection="device.connection_state"
        :device-id="device.id"
        :location="device.location"
        :name="device.name"
        :plant-ids="device.plant_ids"
      />
    </v-col>
    <!-- vertical line as separator -->
    <v-divider vertical />
    <!-- right panel - Plants -->
    <v-row style="margin: 10px">
      <v-col
        v-for="plantId in device?.plant_ids"
        :key="plantId"
        cols="12"
        md="6"
      >
        <PlantCard :plant-id="plantId" />
      </v-col>
    </v-row>
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
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { type Device, useDeviceStore } from '@/stores/devices.ts';

  const deviceStore = useDeviceStore();

  const route = useRoute('/devices/[id]');
  const { isLoading, error } = storeToRefs(deviceStore);
  const id = ref<string>(route.params.id);
  const device = ref<Device | undefined>(undefined);

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
    deviceStore.resolveDeviceById(id.value).then(data => {
      if (data) {
        device.value = data;
      } else {
        console.error('Device not found');
      }
    }).catch(error => {
      console.error('Error fetching device:', error);
    })
  });
</script>
