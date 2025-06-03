<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    :scrim="true"
    scrim-opacity="0.6"
  >
    <v-card>
      <v-card-title class="text-h5">Pflanze löschen?</v-card-title>

      <v-card-text>
        Sind Sie sicher, dass Sie die Pflanze "{{ plant.name }}" dauerhaft löschen möchten?
        Diese Aktion kann nicht rückgängig gemacht werden.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey-lighten-1"
          variant="text"
          @click="cancel"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          :loading="isDeleting"
          @click="confirmDelete"
        >
          Löschen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Plant } from '@/types/plant.ts'

// --- Props ---
const props = defineProps<{
  plant: Plant,
}>();

// --- Emits ---
// confirm: Wird ausgelöst, wenn der Benutzer "Löschen" bestätigt. Gibt plantId zurück.
// cancel: Wird ausgelöst, wenn der Benutzer "Abbrechen" klickt oder den Dialog schließt.
const emit = defineEmits<{
  (e: 'confirm', plantId: string): void;
  (e: 'cancel'): void;
}>();

// --- Interner Zustand ---
const dialog = ref(false); // Steuert die Sichtbarkeit des Dialogs
const isDeleting = ref(false); // Zeigt einen Ladezustand für den Löschen-Button

// --- Methoden zur Steuerung des Dialogs von außen ---
// Ermöglicht der Elternkomponente, den Dialog zu öffnen und zu schließen
const openDialog = () => {
  dialog.value = true;
  isDeleting.value = false; // Zurücksetzen des Ladezustands bei erneutem Öffnen
};
const closeDialog = () => {
  dialog.value = false;
  // isDeleting.value = false; // Könnte auch hier zurückgesetzt werden
};

defineExpose({ openDialog, closeDialog });

// --- Button-Handler ---
const cancel = () => {
  emit('cancel');
  closeDialog();
};

const confirmDelete = async () => {
  isDeleting.value = true; // Ladezustand aktivieren
  // In einem echten Szenario würde hier der API-Aufruf zum Löschen der Pflanze stattfinden.
  // const plantStore = usePlantStore();
  // await plantStore.deletePlant(props.plantId);

  // Nach der (simulierten) Löschoperation
  emit('confirm', props.plant.id);
  closeDialog();
  isDeleting.value = false;
};
</script>
