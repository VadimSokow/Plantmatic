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

  <LoadAndError :error="error" :is-loading="isLoading" @error-cleared="clearError" />
</template>

<script lang="ts" setup>
  import { debounce } from 'lodash'
  import { computed, ref, watch } from 'vue'
  import { useDeviceWithPlants } from '@/composition/deviceWithPlants.ts'

  export interface PlantType {
    latName: string
    commonName: string
    description: string
  }

  const props = defineProps<{
    deviceId: string
  }>()

  const { device, createPlant: createPlantInStore, clearError, isLoading, error } = useDeviceWithPlants(props.deviceId)

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
  const selectedPlantType = ref<PlantType | null>(null) // Speichert das ausgewählte PlantType-Objekt
  const selectedPlantSlot = ref<null | number>(null)

  // --- Logik für die PlantType-Suche ---
  const plantTypeSuggestions = ref<PlantType[]>([]) // Die Liste der Vorschläge
  const isSearchingPlantTypes = ref(false)
  const searchPlantTypeQuery = ref('') // Der aktuelle Suchbegriff im Autocomplete-Feld

  // Simulierter API-Aufruf für PlantType-Suche
  // Dies ersetzt deine Azure Function, die CosmosDB abfragt
  const mockSearchPlantTypes = async (query: string): Promise<PlantType[]> => {
    // Simuliere eine API-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 300))

    const allMockPlantTypes: PlantType[] = [
      {
        latName: 'Monstera deliciosa',
        commonName: 'Fensterblatt',
        description: 'Eine beliebte Zimmerpflanze mit großen, gelappten Blättern, die Löcher entwickeln. Sie bevorzugt helles, indirektes Licht und mäßige Bewässerung.',
      },
      {
        latName: 'Sansevieria trifasciata',
        commonName: 'Bogenhanf',
        description: 'Eine pflegeleichte Zimmerpflanze mit aufrechten, schwertförmigen Blättern. Sie ist sehr trockenheitstolerant und ideal für Anfänger.',
      },
      {
        latName: 'Pothos epipremnum aureum',
        commonName: 'Efeutute',
        description: 'Eine robuste Rankpflanze mit herzförmigen Blättern. Sie ist sehr anpassungsfähig und verträgt verschiedene Lichtverhältnisse.',
      },
      {
        latName: 'Spathiphyllum wallisii',
        commonName: 'Friedenslilie',
        description: 'Eine elegante Zimmerpflanze mit glänzenden Blättern und weißen Blüten. Sie ist bekannt für ihre luftreinigenden Eigenschaften.',
      },
      {
        latName: 'Ficus lyrata',
        commonName: 'Geigenfeige',
        description: 'Eine auffällige Zimmerpflanze mit großen, geigenförmigen Blättern. Sie benötigt helles Licht und eine konstante Feuchtigkeit.',
      },
      {
        latName: 'Aloe vera',
        commonName: 'Echte Aloe',
        description: 'Eine Sukkulente mit fleischigen Blättern, die für ihre medizinischen Eigenschaften bekannt ist. Sie bevorzugt viel Sonnenlicht und wenig Wasser.',
      },
      {
        latName: 'Rosmarinus officinalis',
        commonName: 'Rosmarin',
        description: 'Ein aromatisches Kraut, das in der Küche und als Zierpflanze verwendet wird. Er benötigt viel Sonne und gut durchlässigen Boden.',
      },
      {
        latName: 'Mentha spicata',
        commonName: 'Grüne Minze',
        description: 'Eine beliebte Minzart mit frischem, süßem Geschmack. Sie wächst schnell und benötigt feuchten Boden und etwas Sonne.',
      },
    ]

    // Filtere basierend auf der Abfrage (case-insensitive und startsWith/includes)
    const lowerCaseQuery = query.toLowerCase()
    return allMockPlantTypes.filter(
      type =>
        type.commonName.toLowerCase().includes(lowerCaseQuery)
        || type.latName.toLowerCase().includes(lowerCaseQuery),
    )
  }

  // Debounced-Funktion für die Suche, um nicht zu viele Anfragen zu senden
  const debouncedSearch = debounce(async (query: string) => {
    if (!query) {
      plantTypeSuggestions.value = []
      isSearchingPlantTypes.value = false
      return
    }
    isSearchingPlantTypes.value = true
    try {
      plantTypeSuggestions.value = await mockSearchPlantTypes(query)
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
    // Pflanzenname muss nicht leer sein und ein PlantType muss ausgewählt sein
    return !!plantName.value && selectedPlantType.value !== null
  })

  // --- Erstellen-Funktion ---
  const createPlant = () => {
    if (!isFormValid.value) {
      console.warn('Formular ist nicht gültig.')
      return
    }

    if (!selectedPlantType.value) {
      console.warn('Plant type is invalid.')
    }
    const selection = selectedPlantType.value as PlantType

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
    // Hier würde dein API-Aufruf zum Backend erfolgen, z.B.:
    // plantStore.createPlant(newPlantData)
    //   .then(() => {
    //     console.log('Pflanze erfolgreich erstellt!');
    //     closeDialog();
    //     // Optional: Event emit, um die übergeordnete Komponente zu informieren
    //     // emit('plantCreated', newPlantData);
    //   })
    //   .catch(err => {
    //     console.error('Fehler beim Erstellen der Pflanze:', err);
    //     // Fehlerbehandlung, z.B. Snackbar anzeigen
    //   });

    // Nach dem Konsolen-Output den Dialog schließen und Felder zurücksetzen
    closeDialog()
    plantName.value = ''
    selectedPlantType.value = null
    plantTypeSuggestions.value = []
  }

  // --- Watcher zum Zurücksetzen des Suchfeldes, wenn selectedPlantType gesetzt wird ---
  // Dies verhindert, dass der Text im Autocomplete-Feld verschwindet, wenn ein Item ausgewählt wird.
  // Vuetify 3 Autocomplete handhabt das oft automatisch, aber es schadet nicht, es zu haben.
  watch(selectedPlantType, newValue => {
    if (newValue && newValue.commonName !== searchPlantTypeQuery.value) {
      searchPlantTypeQuery.value = newValue.commonName
    }
  })
</script>
