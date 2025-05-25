<template>
  <v-container>
    <v-col>
      <h2>{{ data.name }}</h2>
      <p>Gerät ID: {{ data.deviceId }}</p>
      <p>Standort: {{ data.location }}</p>
      <p>Slots: {{ data.slotsUsed }} / {{ data.slotsTotal }}</p>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    slotsTotal: {
      type: Number,
      required: true,
    },
    slotsUsed: {
      type: Number,
      required: true,
    },
  });

  const data = ref({
    deviceId: props.deviceId,
    name: props.name,
    location: props.location,
    slotsTotal: props.slotsTotal,
    slotsUsed: props.slotsUsed,
  })

  watch(() => props.deviceId, newId => {
    data.value.deviceId = newId;
  });

  watch(() => props.name, newName => {
    data.value.name = newName;
  });

  watch(() => props.location, newLocation => {
    data.value.location = newLocation;
  });

  watch(() => props.slotsTotal, newSlotsTotal => {
    data.value.slotsTotal = newSlotsTotal;
  });

  watch(() => props.slotsUsed, newSlotsUsed => {
    data.value.slotsUsed = newSlotsUsed;
  });
</script>
