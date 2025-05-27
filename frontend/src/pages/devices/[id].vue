<template>
  <v-container v-if="deviceIsOk" fluid>
    <v-row>
      <!-- left panel - Device Info -->
      <v-col cols="auto">
        <DevicePanel
          :device-id="dev.device.id"
          :location="dev.device.location"
          :name="dev.device.name"
          :slots-total="dev.model.slot_count"
          :slots-used="dev.device.plantSlots.length"
        />
      </v-col>
      <!-- right panel - Plants-->
      <v-row lg="9" md="8" style="margin: 10px">
        <v-col
          v-for="plant in plants"
          :key="plant.plantId"
          cols="12"
          lg="4"
          md="6"
          sm="6"
        >
          <PlantCard
            :device-model-id="dev.model.id"
            :device-plant-slot="plant.slotNumber"
            :plant-id="plant.plantId"
          />
        </v-col>
      </v-row>
    </v-row>
  </v-container>

  <LoadAndError
    :error="deviceInfo.error.value"
    :is-loading="deviceInfo.isLoading.value"
    @error-cleared="deviceInfo.error.value = null"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useDeviceInfo } from '@/composition-api/useDeviceInfo.ts';

  const route = useRoute('/devices/[id]');
  const id = ref<string>(route.params.id);

  const deviceInfo = useDeviceInfo(id.value);
  const dev = deviceInfo.deviceInfo;

  const deviceIsOk = computed(() => {
    return dev.value != undefined && dev.value.device != undefined && dev.value.model != undefined;
  })

  const plants = computed(() => {
    return dev.value.device.plantSlots.filter(plantId => plantId.plantId != null).map(plant => plant as {
      plantId: string,
      slotNumber: number,
    });
  })

  onMounted(() => {
    deviceInfo.loadDeviceInfo();
  });
</script>
