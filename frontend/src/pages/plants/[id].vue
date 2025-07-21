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

  // --- Handler für die Bestätigung des Löschens ---
  const handlePlantDeleteConfirmed = async (plantId: string) => {
    console.log(`Löschen der Pflanze mit ID: ${plantId} bestätigt.`)

  // Hier würde der tatsächliche API-Aufruf zum Löschen stattfinden:
  // try {
  //   const plantStore = usePlantStore(); // Annahme: Du hast einen Plant Store
  //   await plantStore.deletePlant(plantId); // Die Aktion in deinem Pinia Store
  //   console.log(`Pflanze ${plantId} erfolgreich gelöscht!`);
  //   // Optional: Benachrichtigung anzeigen (Snackbar)
  //   // Optional: Zurück zur vorherigen Seite navigieren oder Liste aktualisieren
  //   // router.back(); // Oder router.push('/plants');
  // } catch (error) {
  //   console.error(`Fehler beim Löschen der Pflanze ${plantId}:`, error);
  //   // Fehlerbehandlung, z.B. Fehlermeldung im UI anzeigen
  // }
  }

  // --- Handler, wenn das Löschen abgebrochen wird ---
  const handleDeleteCanceled = () => {
    console.log('Löschen der Pflanze abgebrochen.')
  }

  onMounted(() => {
    loadAllData(true)
  })
</script>
