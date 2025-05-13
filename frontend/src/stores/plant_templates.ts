import {defineStore} from 'pinia';
import type {PlantTemplate} from "@/types/plant_templates.ts";
import {fetchPlantTemplates} from "@/api/plant_templates.ts";

export const usePlantTemplateStore = defineStore('plant_templates', {
  state: () => ({
    plantTemplates: [] as PlantTemplate[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPlantTemplates() {
      this.loading = true;
      this.error = null;
      try {
        this.plantTemplates = await fetchPlantTemplates();
      } catch (error: any) {
        this.error = error.message || 'Fehler beim Laden der Pflanzenvorlagen.';
      } finally {
        this.loading = false;
      }
    },
    // ... weitere Aktionen
  },
  getters: {
    allPlantTemplates: (state) => state.plantTemplates,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
  },
});


