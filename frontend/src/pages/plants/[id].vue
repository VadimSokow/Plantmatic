<template>
  <v-container v-if="!isLoading">
    <v-row>
      <v-col cols="auto">
        <DevicePanel :device="device" :slots="null" />
        <v-divider/>
        <PlantPanel :plant="plant" :slot-number="slotNumber" :sensors="device.model.sensors"/>
        <v-divider/>
        <v-btn color="error" @click="openDeleteDialog()">
          Pflanze löschen
        </v-btn>
      </v-col>
      <v-col>
        <PlantChartCard :plant="plant" :field-name="'temp_air'" :sensors="[]" />
      </v-col>
    </v-row>
  </v-container>

  <DeletePlantDialog
    ref="deletePlantDialogRef"
    :plant="plant"
    @confirm="handlePlantDeleteConfirmed"
    @cancel="handleDeleteCanceled"
  />

  <LoadAndError
    :error="error"
    :is-loading="isLoading"
    @error-cleared="clearError()"
  />
</template>

<script setup lang="ts">
import { useDeviceWithPlant } from '@/composition/deviceWithPlant.ts'
import DeletePlantDialog from '@/components/dialog/DeletePlantDialog.vue'

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
  error,
  loadAllData,
  clearError,
} = useDeviceWithPlant(id.value)

const deletePlantDialogRef = ref<InstanceType<typeof DeletePlantDialog> | null>(null);

const openDeleteDialog = () => {
  if (deletePlantDialogRef.value) {
    deletePlantDialogRef.value.openDialog();
  }
}

// --- Handler für die Bestätigung des Löschens ---
const handlePlantDeleteConfirmed = async (plantId: string) => {
  console.log(`Löschen der Pflanze mit ID: ${plantId} bestätigt.`);

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
};

// --- Handler, wenn das Löschen abgebrochen wird ---
const handleDeleteCanceled = () => {
  console.log('Löschen der Pflanze abgebrochen.');
};

onMounted(() => {
  loadAllData(true)
})
</script>
