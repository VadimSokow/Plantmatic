<template>
  <v-dialog
    v-model="showError"
    persistent
    width="auto"
  >
    <v-card>
      <v-card-text>
        {{ error }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="clearError"
        >
          Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const props = defineProps({
    error: {
      type: [String, null],
      required: true,
    },
  })
  const emit = defineEmits(['error-cleared'])

  const showError = computed(() => data.value.error != null && !data.value.clearErrorPressed)

  const data = ref({
    error: props.error,
    clearErrorPressed: false,
  })

  watch(props, () => {
    data.value.error = props.error
  })

  const clearError = () => {
    data.value.clearErrorPressed = true
    setTimeout(() => {
      emit('error-cleared')
      data.value.clearErrorPressed = false
    }, 300)
  }
</script>
