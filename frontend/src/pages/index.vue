<template>
  <v-container>
    <h1>Pflanzenvorlagen</h1>
    <div v-if="loading">Lade Daten...</div>
    <div v-else-if="error">Fehler beim Laden: {{ error }}</div>
    <v-list v-else>
      <v-list-item v-for="plant in plantTemplates" :key="plant.id">
        <v-list-item-title>{{ plant.comname }} ({{ plant.latname }})</v-list-item-title>
        <v-list-item-subtitle>Bodenfeuchtigkeit: {{ plant.config.soil_moisture }}</v-list-item-subtitle>
        <v-list-item-subtitle>Kategorie: {{ plant.category }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {onMounted} from 'vue';
import {usePlantTemplateStore} from "@/stores/plant_templates.ts";

const plantStore = usePlantTemplateStore();
const {plantTemplates, isLoading, hasError} = storeToRefs(plantStore);

onMounted(() => {
  plantStore.fetchPlantTemplates();
});
</script>
