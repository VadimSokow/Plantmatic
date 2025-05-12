<template>
  <h1>{{ device }}</h1>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute('/devices/[id]');
const id = ref<string>(route.params.id);
const device = ref<string>('');

onMounted(() => {
  device.value = id.value;
});
</script>
