<template>
  <v-container v-if="!isLoading">
    <v-row>
      <v-col cols="auto">
        <DevicePanel :device="device" :slots="null" />
        <v-divider />
        <PlantPanel :plant="plant" :sensors="device.model.sensors" :slot-number="slotNumber" />
        <v-divider />
        <v-btn color="error" @click="openDeleteDialog()">
          Pflanze löschen
        </v-btn>
      </v-col>
      <v-col
        v-for="sensor in sensors"
        :key="sensor.fieldName"
        cols="12"
        md="6"
      >
        <PlantChartCard
          :field-name="sensor.fieldName"
          :plant="plant"
          :sensors="sensors"
        />
      </v-col>
    </v-row>
  </v-container>

  <DeletePlantDialog
    ref="deletePlantDialogRef"
    :plant="plant"
    @cancel="handleDeleteCanceled"
    @confirm="handlePlantDeleteConfirmed"
  />
</template>

<script setup lang="ts">
  import DeletePlantDialog from '@/components/dialog/DeletePlantDialog.vue'
  import { useDeviceWithPlant } from '@/composition/deviceWithPlant.ts'
  import router from '@/router'

  definePage({
    meta: {
      requireDevice: true,
    },
  })

  const route = useRoute('/plants/[id]')
  const id = ref<string>(route.params.id)

  const {
    device,
    plant,
    slotNumber,
    isLoading,
    deletePlant,
    loadAllData,
  } = useDeviceWithPlant(id.value)

  const sensors = computed(() => {
    if (!device.value || !device.value.model) {
      return []
    }
    return Object.values(device.value.model.sensors).filter(s => s.slot === slotNumber.value)
  })

  const deletePlantDialogRef = ref<InstanceType<typeof DeletePlantDialog> | null>(null)

  const openDeleteDialog = () => {
    if (deletePlantDialogRef.value) {
      deletePlantDialogRef.value.openDialog()
    }
  }

  const handlePlantDeleteConfirmed = async () => {
    console.log(`delete plant with id`)
    try {
      await deletePlant()
      console.log('plant has been deleted')
    } catch (error) {
      console.error('Error deleting plant:', error)
    } finally {
      if (deletePlantDialogRef.value) {
        deletePlantDialogRef.value.closeDialog()
      }
      await loadAllData(true)
      // navigate to the device page
      const deviceId = device.value?.id
      if (deviceId) {
        // pop current route from history
        await router.replace(`/devices/${deviceId}`)
      } else {
        console.error('Device ID is not available after deletion')
      }
    }
  }

  const handleDeleteCanceled = () => {
    console.log('delete canceled')
  }

  onMounted(() => {
    loadAllData(true)
  })
</script>
