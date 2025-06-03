<template>
  <v-container>
    <v-col>
      <h2>{{ device.name }}</h2>
      <p>Gerät ID: {{ device.id }}</p>
      <p>Standort: {{ device.location }}</p>
      <p v-if="slots">Slots: {{ slots.used }} / {{ slots.total }}</p>
      <v-btn v-if="slots" class="add-button" color="primary" @click="openCreatePlantDialog">
        <v-icon left>mdi-plus</v-icon>
        Pflanze hinzufügen
      </v-btn>
    </v-col>

    <CreatePlantDialog ref="createPlantDialogRef" />
  </v-container>
</template>

<script setup lang="ts">
import type { Device } from '@/types/device.ts'
import CreatePlantDialog from '@/components/dialog/CreatePlantDialog.vue'

defineProps<{
  device: Device,
  slots: {
    total: number,
    used: number,
  } | null
}>()

const createPlantDialogRef = ref<InstanceType<typeof CreatePlantDialog> | null>(null)

const openCreatePlantDialog = () => {
  if (createPlantDialogRef.value) {
    createPlantDialogRef.value.openDialog()
  }
}
</script>

<style scoped>
.add-button {
  margin: 15px;
}
</style>
