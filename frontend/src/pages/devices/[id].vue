<template>
  <v-container fluid v-if="device != undefined">
    <v-row>
      <!-- left panel - Device Info -->
      <v-col cols="auto">
        <DevicePanel
          :device-id="device.id"
          :location="device.location"
          :name="device.name"
          :slots-total="4"
          :slots-used="2"
        />
      </v-col>
      <!-- right panel - Plants-->
      <v-row style="margin: 10px" md="8" lg="9">
        <v-col
          v-for="slot in device.plantSlots"
          :key="slot.plantId"
          cols="12"
          sm="6"
          md="6"
          lg="4"
        >
          <PlantCard :plant-id="slot.plantId" />
        </v-col>
      </v-row>
    </v-row>
  </v-container>

  <LoadAndError
    :error="deviceStore.error"
    :is-loading="deviceStore.isLoading"
    @error-cleared="deviceStore.$patch({ error: null })"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { type Device } from '@/types/device.ts';
  import { useDeviceStore } from '@/stores/devices.ts';

  const deviceStore = useDeviceStore();

  const route = useRoute('/devices/[id]');
  const id = ref<string>(route.params.id);
  const device = ref<Device | undefined>(undefined);

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
