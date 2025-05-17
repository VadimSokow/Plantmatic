import type { PlantTemplate } from '@/types/plant_templates.ts';
import { apiClient } from '@/api/client.ts';

export const fetchPlantTemplates = async (): Promise<PlantTemplate[]> => {
  try {
    const response = await apiClient.get<PlantTemplate[]>('/getPlants');
    return response.data;
  } catch (error: unknown) {
    console.error('Fehler beim Laden der Pflanzendaten:', error);
    throw error;
  }
};
