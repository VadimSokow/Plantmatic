<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />

    <LoadAndError
      :error="error"
      :is-loading="isLoading"
      @error-cleared="clearError()"
    />
  </v-app>
</template>

<script setup lang="ts">
  import { useLoadAndError } from '@/composition/loadAndError.ts'

  const {
    isLoading,
    error,
    clearError,
  } = useLoadAndError()
</script>
