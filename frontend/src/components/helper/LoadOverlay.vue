<template>
  <v-overlay
    class="align-center justify-center"
    :model-value="isLoading"
    persistent
    scrim="black"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps({
    isLoading: {
      type: Boolean,
      required: true,
    },
  })

  const isLoading = ref<boolean>(props.isLoading)

  watch(props, () => {
    isLoading.value = props.isLoading
  })
</script>
