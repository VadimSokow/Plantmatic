<template>
  <v-row v-if="device != undefined">
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
    <!-- vertical line as separator -->
    <v-divider vertical />
    <!-- right panel - Plants -->
    <!--    <v-row style="margin: 10px">-->
    <!--      <v-col-->
    <!--        v-for="plantId in device?.plant_ids"-->
    <!--        :key="plantId"-->
    <!--        cols="12"-->
    <!--        md="6"-->
    <!--      >-->
    <!--        <PlantCard :plant-id="plantId" />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
  </v-row>

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
