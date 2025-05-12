<template>
  <v-container>
    <v-row>
      <v-col v-for="device in devices" :key="device.name" cols="12" md="4">
        <DeviceCard
          :deviceId="device.id"
          :name="device.name"
          :modell="device.model"
          :connection="device.connection"
          :state="device.state"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const devices = ref([
  {
    id: "123",
    name: 'Device 1',
    model: 'Model A',
    connection: 'WiFi',
    state: 'Online',
  },
  {
    id: "32",
    name: 'Device 2',
    model: 'Model B',
    connection: 'Bluetooth',
    state: 'Offline',
  },
  {
    id: "sef",
    name: 'Device 3',
    model: 'Model C',
    connection: 'Zigbee',
    state: 'Online',
  }
]);
</script>
