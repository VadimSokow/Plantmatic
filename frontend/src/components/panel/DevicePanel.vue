<template>
  <v-container>
    <v-col>
      <h2>{{ name }}</h2>
      <p>Gerät ID: {{ deviceId }}</p>
      <p>Verbindung: {{ connection }}</p>
      <p>Standort: {{ location }}</p>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
  defineProps({
    deviceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    connection: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  });
</script>
