<template>
  <v-row class="ma-2">
    <v-btn-toggle v-model="selectedPeriod" class="mr-4" dense mandatory>
      <v-btn value="last24h">Letzte 24h</v-btn>
      <v-btn value="today">Heute</v-btn>
      <v-btn value="yesterday">Gestern</v-btn>
      <v-btn value="last7days">Letzte 7 Tage</v-btn>
      <v-btn value="test">Test</v-btn>
    </v-btn-toggle>

    <!--    <v-btn :color="selectedPeriod === 'custom' ? 'primary' : ''" @click="showCustomDateRange = !showCustomDateRange">-->
    <!--      Eigener Zeitraum-->
    <!--    </v-btn>-->
  </v-row>

  <v-expand-transition>
    <v-card v-if="showCustomDateRange" class="mt-4 pa-4">
      <v-row>
        <v-col cols="12" sm="6">
          <v-menu
            v-model="startDateMenu"
            :close-on-content-click="false"
            min-width="auto"
            offset-y
            transition="scale-transition"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="Startdatum"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="startDate"
              :max="endDate || new Date().toISOString().substr(0, 10)"
              @input="startDateMenu = false"
            />
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu
            v-model="endDateMenu"
            :close-on-content-click="false"
            min-width="auto"
            offset-y
            transition="scale-transition"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                label="Enddatum"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="endDate"
              :max="calculatedMaxEndDate"
              :min="startDate"
              @input="endDateMenu = false"
            />
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </v-expand-transition>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'

  // Definiere die Typen für das emittierte Event
  interface TimeRange {
    start: string | null
    end: string | null
  }

  // Definiere die Emits mit ihren Typen
  const emit = defineEmits<{
    (e: 'update:timeRange', payload: TimeRange): void
  }>()

  // Reaktive Daten mit Typen
  const selectedPeriod = ref<'last24h' | 'today' | 'yesterday' | 'last7days' | 'custom'>('last24h')
  const showCustomDateRange = ref<boolean>(false)
  const startDate = ref<string | null>(null)
  const endDate = ref<string | null>(null)
  const startDateMenu = ref<boolean>(false)
  const endDateMenu = ref<boolean>(false)

  // Computed Property für das maximale Enddatum
  const calculatedMaxEndDate = computed<string | null>(() => {
    if (!startDate.value) return null
    const start = new Date(startDate.value)
    start.setDate(start.getDate() + 7) // Max 7 Tage Differenz
    return start.toISOString().slice(0, 10)
  })

  // Funktion zum Emittieren des Events
  const emitTimeRange = () => {
    let startTime: Date | null = null
    let endTime: Date | null = null

    switch (selectedPeriod.value) {
      case 'last24h': {
        endTime = new Date()
        startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000)
        break
      }
      case 'today': {
        startTime = new Date()
        startTime.setHours(0, 0, 0, 0)
        endTime = new Date()
        endTime.setHours(23, 59, 59, 999)
        break
      }
      case 'yesterday': {
        startTime = new Date()
        startTime.setDate(startTime.getDate() - 1)
        startTime.setHours(0, 0, 0, 0)
        endTime = new Date(startTime)
        endTime.setHours(23, 59, 59, 999)
        break
      }
      case 'last7days': {
        endTime = new Date()
        startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      }
      case 'custom': {
        if (startDate.value && endDate.value) {
          startTime = new Date(startDate.value)
          startTime.setHours(0, 0, 0, 0)
          endTime = new Date(endDate.value)
          endTime.setHours(23, 59, 59, 999)
        }
        break
      }
      case 'test': {
        startTime = new Date(1_749_254_699_998)
        endTime = new Date(1_749_513_599_999)
      }
    }

    // Emittiere das Event nur, wenn startTime und endTime gültig sind
    if (startTime && endTime) {
      emit('update:timeRange', { start: startTime.toISOString(), end: endTime.toISOString() })
    } else {
      emit('update:timeRange', { start: null, end: null })
    }
  }

  // Beobachter für Änderungen
  watch(selectedPeriod, newVal => {
    if (newVal !== 'custom') {
      showCustomDateRange.value = false
    }
    emitTimeRange()
  })

  watch(showCustomDateRange, newVal => {
    if (newVal && selectedPeriod.value !== 'custom') {
      selectedPeriod.value = 'custom'
      // Setze Standardwerte, wenn "eigener Zeitraum" ausgewählt wird und noch keine Daten da sind
      if (!startDate.value || !endDate.value) {
        const today = new Date()
        endDate.value = today.toISOString().slice(0, 10)
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 6)
        startDate.value = sevenDaysAgo.toISOString().slice(0, 10)
      }
    }
  })

  watch([startDate, endDate], () => {
    // Logische Korrektur der Daten (Enddatum nicht vor Startdatum, etc.)
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      if (start > end) {
        // Wenn start > end, setze end = start. Dies kann je nach dem, was sinnvoller ist, angepasst werden.
        // Hier nehmen wir an, dass die letzte Änderung die 'richtige' ist und passen die andere an.
        // Eine robustere Lösung könnte sein, zu prüfen, welches Feld zuletzt geändert wurde.
        // Für Einfachheit passen wir hier das Enddatum an, wenn Start > End ist.
        endDate.value = startDate.value
      }
    }
    // Stelle sicher, dass die Auswahl auf "custom" ist, wenn Daten manuell geändert werden
    if (selectedPeriod.value !== 'custom') {
      selectedPeriod.value = 'custom'
    }
    emitTimeRange()
  })

  // Beim ersten Laden die initiale Zeitspanne emittieren
  onMounted(() => {
    emitTimeRange()
  })
</script>

<style scoped>
/* Optional: Füge hier spezifisches Styling hinzu, falls benötigt */
</style>
