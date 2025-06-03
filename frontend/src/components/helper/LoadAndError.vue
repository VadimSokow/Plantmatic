<template>
  <LoadOverlay v-if="!error" :is-loading="isLoading" />
  <ErrorOverlay :error="error" />
</template>

<script setup lang="ts">
  defineProps({
    isLoading: {
      type: Boolean,
      required: true,
    },
    error: {
      type: [String, null],
      required: true,
    },
  })

  defineEmits(['error-cleared'])
</script>
