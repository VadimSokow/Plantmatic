import type { Device, DeviceModel } from '@/types/device.ts';
import type { Plant, PlantType } from '@/types/plant.ts';
import { useDeviceStore } from '@/stores/devices.ts';
import { usePlantStore } from '@/stores/plants.ts';
import { useDeviceModelStore } from '@/stores/deviceModels.ts';
import { usePlantTypesStore } from '@/stores/plantTypes.ts';

export interface PlantInfo {
  plant: Plant
  plantType: PlantType | undefined
}

export interface DeviceInfo {
  device: Device
  model: DeviceModel
  // <slotNumber, PlantInfo>
  plants: Map<number, PlantInfo>
  isLoading: boolean
  error: string | null
}

export const useDeviceInfo = (deviceId: string) => {
  const deviceStore = useDeviceStore();
  const deviceModelStore = useDeviceModelStore();
  const plantStore = usePlantStore();
  const plantTypeStore = usePlantTypesStore();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const deviceInfo = computed<DeviceInfo>(() => {
    const device = deviceStore.getDeviceById(deviceId);
    const model = device ? deviceModelStore.getDeviceModelById(device.modelId) : undefined;

    const plantsMap = new Map<number, PlantInfo>();

    if (device?.plantSlots) {
      device.plantSlots.forEach(slot => {
        if (slot.plantId) {
          const plant = plantStore.getPlantById(slot.plantId);
          const plantType = plant ? plantTypeStore.getPlantTypeById(plant.plantTypeId) : undefined;
          if (plant && plantType) plantsMap.set(slot.slotNumber, { plant, plantType });
        }
      });
    }

    return {
      device,
      model,
      plants: plantsMap,
      isLoading: isLoading.value,
      error: error.value,
    } as DeviceInfo;
  });

  const loadDeviceInfo = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // 1. Gerät laden
      await deviceStore.fetchDevice(deviceId);
      const device = deviceStore.getDeviceById(deviceId);

      if (!device) {
        throw new Error(`Device with ID ${deviceId} not found.`);
      }

      // 2. Modell laden
      await deviceModelStore.fetchDeviceModel(device.modelId);

      // 3. Pflanzen und ihre Typen laden
      const plantLoadPromises: Promise<Plant | null>[] = [];
      const plantTypeLoadPromises: Promise<PlantType | undefined>[] = [];

      device.plantSlots.forEach(slot => {
        if (slot.plantId) {
          plantLoadPromises.push(plantStore.resolvePlant(slot.plantId));
        }
      });

      await Promise.all(plantLoadPromises); // Alle Pflanzen laden

      // Nach dem Laden der Pflanzen, deren Typen laden
      device.plantSlots.forEach(slot => {
        if (slot.plantId) {
          const plant = plantStore.getPlantById(slot.plantId);
          if (plant) {
            plantTypeLoadPromises.push(plantTypeStore.fetchPlantType(plant.plantTypeId));
          }
        }
      });

      await Promise.all(plantTypeLoadPromises); // Alle Pflanzentypen laden

    } catch (err) {
      console.error(`Failed to load device info for ${deviceId}:`, err);
      error.value = `Failed to load device info: ${err instanceof Error ? err.message : 'Unknown error'}`;
    } finally {
      isLoading.value = false;
    }
  };

  // Rückgabe der Pinia-Store-Objekte (ähnlich wie defineStore)
  return {
    deviceInfo,
    loadDeviceInfo,
    isLoading: computed(() => isLoading.value),
    error,
  };
}
