<template>
  <v-dialog v-model="dialog" max-width="600" :scrim="true" scrim-opacity="0.6">
    <v-card>
      <v-card-title class="text-h5">Pflanze erstellen</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="plantName"
          class="mb-4"
          clearable
          density="compact"
          label="Pflanzenname"
          variant="outlined"
        />

        <v-select
          v-model="selectedPlantSlot"
          density="compact"
          :items="plantSlots"
          label="Plant Slot"
          no-data-text="Alle Slots bereits belegt."
          variant="outlined"
        />

        <v-autocomplete
          v-model="selectedPlantType"
          chips
          clearable
          closable-chips
          density="compact"
          item-title="commonName"
          item-value="id"
          :items="plantTypeSuggestions"
          label="Pflanzentyp suchen"
          :loading="isSearchingPlantTypes"
          no-data-text="Keine Typen gefunden"
          return-object
          :search="searchPlantTypeQuery"
          variant="outlined"
          @update:search="onSearchPlantType"
        >
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :subtitle="item.raw.latName"
              :title="item.raw.commonName"
            />
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-grey-lighten-1" variant="text" @click="closeDialog">
          Abbrechen
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          variant="elevated"
          @click="createPlant"
        >
          Erstellen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { PlantTypeBase } from '@/types/plant.ts'
  import { debounce } from 'lodash'
  import { computed, ref, watch } from 'vue'
  import { useDeviceWithPlants } from '@/composition/deviceWithPlants.ts'
  import { usePlantTypeSearchStore } from '@/stores/plantTypeSearch.ts'

  const plantTypeSearchStore = usePlantTypeSearchStore()

  onMounted(() => {
    plantTypeSearchStore.fetchTypes()
  })

  const props = defineProps<{
    deviceId: string
  }>()

  const { device, createPlant: createPlantInStore } = useDeviceWithPlants(props.deviceId)

  const plantSlots = computed(() => {
    if (!device.value) {
      return []
    }
    return device.value.plantSlots.filter(slot => slot.plantId === null).map(slot => slot.slotNumber)
  })

  // --- Props und Emits für die Dialog-Steuerung ---
  const dialog = ref(false) // Interner Zustand für die Sichtbarkeit des Dialogs

  // Exposes Methoden, um den Dialog von außen zu öffnen/schließen
  const openDialog = () => {
    dialog.value = true
  }
  const closeDialog = () => {
    dialog.value = false
  }

  defineExpose({ openDialog, closeDialog })

  // --- Formularfelder ---
  const plantName = ref('')
  const selectedPlantType = ref<PlantTypeBase | null>(null)
  const selectedPlantSlot = ref<null | number>(null)

  // --- Logik für die PlantType-Suche ---
  const plantTypeSuggestions = ref<PlantTypeBase[]>([])
  const isSearchingPlantTypes = ref(false)
  const searchPlantTypeQuery = ref('')

  // Debounced-Funktion für die Suche, um nicht zu viele Anfragen zu senden
  const debouncedSearch = debounce(async (query: string) => {
    if (!query) {
      plantTypeSuggestions.value = []
      isSearchingPlantTypes.value = false
      return
    }
    isSearchingPlantTypes.value = true
    try {
      plantTypeSuggestions.value = plantTypeSearchStore.searchByName(query)
    } catch (error) {
      console.error('Fehler bei der PlantType-Suche:', error)
      plantTypeSuggestions.value = []
    } finally {
      isSearchingPlantTypes.value = false
    }
  }, 300) // 300ms Debounce-Zeit

  // Handler für die Autocomplete-Suchfunktion
  const onSearchPlantType = (query: string) => {
    searchPlantTypeQuery.value = query
    debouncedSearch(query)
  }

  // --- Validierung für den Erstellen-Button ---
  const isFormValid = computed(() => {
    return !!plantName.value && selectedPlantType.value !== null
  })

  const createPlant = () => {
    if (!isFormValid.value) {
      console.warn('Formular ist nicht gültig.')
      return
    }

    if (!selectedPlantType.value) {
      console.warn('Plant type is invalid.')
    }
    const selection = selectedPlantType.value as PlantTypeBase

    if (!selectedPlantSlot.value) {
      console.warn('Plant type is invalid.')
    }
    const slotNumber = selectedPlantSlot.value as number

    console.log('Neue Pflanze erstellen:', {
      latName: selection.latName,
      commonName: selection.commonName,
      plantName: plantName.value,
    })
    createPlantInStore(slotNumber, selection.latName, plantName.value)

    closeDialog()
    plantName.value = ''
    selectedPlantType.value = null
    plantTypeSuggestions.value = []
  }

  watch(selectedPlantType, newValue => {
    if (newValue && newValue.commonName !== searchPlantTypeQuery.value) {
      searchPlantTypeQuery.value = newValue.commonName
    }
  })
</script>
