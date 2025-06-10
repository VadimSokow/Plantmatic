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
  import { debounce } from 'lodash'
  import { computed, ref, watch } from 'vue'

  export interface PlantType {
    id?: string // PK in DB, könnte latName sein, hier generische ID
    latName: string
    commonName: string
    description: string
  // configFields: PlantConfigField[]; // Für dieses Mockup nicht benötigt
  }

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
        id: '1',
        latName: 'Solanum lycopersicum',
        commonName: 'Tomate',
        description: 'Leckere rote Frucht.',
      },
      {
        id: '2',
        latName: 'Capsicum annuum',
        commonName: 'Paprika',
        description: 'Vielseitiges Gemüse.',
      },
      {
        id: '3',
        latName: 'Mentha spicata',
        commonName: 'Minze',
        description: 'Frisches Kraut für Tee.',
      },
      {
        id: '4',
        latName: 'Fragaria x ananassa',
        commonName: 'Erdbeere',
        description: 'Beliebte Sommerfrucht.',
      },
      {
        id: '5',
        latName: 'Ocimum basilicum',
        commonName: 'Basilikum',
        description: 'Aromatische Kräuter.',
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

    const newPlantData = {
      name: plantName.value,
      plantTypeId:
        selectedPlantType.value?.id || selectedPlantType.value?.latName, // Verwende ID oder latName als Referenz
      plantTypeName: selectedPlantType.value?.commonName, // Optional: Speichere den commonName zur Anzeige
    // Hier könnten weitere Felder hinzugefügt werden, wenn das Formular erweitert wird
    }

    console.log('Neue Pflanze erstellen:', newPlantData)

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
