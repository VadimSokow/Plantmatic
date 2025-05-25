<template>
  <v-card v-if="plant" :to="`/plants/${props.plantId}`" variant="outlined">
    <v-card-title>
      <v-icon icon="mdi-leaf" />
      {{ plant.name }}
    </v-card-title>
    <v-card-text>
      <!--      <p>Art: {{ plant.type.common_name }}</p>-->
      <!--      <p>Latein: {{ plant.type.lat_name }}</p>-->
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { type Plant } from '@/types/plant.ts';
  import { usePlantStore } from '@/stores/plants.ts';
  import { ref } from 'vue';

  const plantStore = usePlantStore();

  const plant = ref<Plant | null>(null);

  onMounted(() => {
    plantStore.resolvePlant(props.plantId).then(data => {
      plant.value = data;
    }).catch(error => {
      console.error('Error fetching plant:', error);
    })
  })

  const props = defineProps({
    plantId: {
      type: String,
      required: true,
    },
  });
</script>
