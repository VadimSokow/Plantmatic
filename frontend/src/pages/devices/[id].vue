<template>
  <v-container v-if="device">
    <v-row>
      <!-- left panel - Device Info -->
      <v-col cols="auto">
        <DevicePanel :device="device" :slots="deviceSlots" />
      </v-col>
      <!-- right panel - Plants-->
      <v-row lg="9" md="8" style="margin: 10px">
        <v-col
          v-for="plant in plants"
          :key="plant.id"
          cols="12"
          lg="4"
          md="6"
          sm="6"
        >
          <PlantCard
            :plant="plant"
            :sensors="device.model.sensors"
            :slot-number="resolvePlantSlot(plant.id)"
          />
        </v-col>
      </v-row>
    </v-row>
  </v-container>
  <LoadAndError
    :error="error"
    :is-loading="isLoading"
    @error-cleared="clearError()"
  />
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useDeviceWithPlants } from '@/composition/deviceWithPlants.ts'

  const route = useRoute('/devices/[id]')
  const id = ref<string>(route.params.id)

  const {
    device,
    plants,
    isLoading,
    error,
    loadAllData,
    clearError,
  } = useDeviceWithPlants(id.value)

  const deviceSlots = computed(() => {
    return {
      total: device.value.model.slotCount,
      used: plants.value.length,
    }
  })

  function resolvePlantSlot (plantId: string): number | null {
    for (const plantSlot of device.value.plantSlots) {
      if (!plantSlot.plantId) continue
      if (plantSlot.plantId == plantId)
        return plantSlot.slotNumber
    }
    return null
  }

  onMounted(() => {
    loadAllData()
  })
</script>
