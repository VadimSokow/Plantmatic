<!--
Die DeviceCard zeigt nur wenige Informationen zu einem Gerät an.
Sie wird typischerweise zur Übersicht über alle Geräte verwendet.
-->

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
    modell: {
      type: String,
      required: true,
    },
    connection: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <v-card variant="outlined">
    <v-card-title>{{ name }}</v-card-title>
    <v-card-subtitle>{{ modell }}</v-card-subtitle>
    <v-card-text>
      <p>Verbindung: {{ connection }}</p>
      <p>Zustand: {{ state }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :to="`/device/${deviceId}`">
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
