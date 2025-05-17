<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn class="text-none" v-bind="props">
        <span class="mr-2">{{ username }}</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
  import { useMsal } from '../composition-api/useMsal';

  const { instance } = useMsal();

  const username = instance.getAllAccounts()[0]?.username || null;

  const logout = () => instance.logoutRedirect();
</script>
