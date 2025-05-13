<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import router from "@/router";
import AuthButton from "@/components/AuthButton.vue";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <v-app-bar app>
    <div style="margin-left: 10px"/>
    <v-icon icon="mdi-leaf"/>
    <v-app-bar-title>Plantmatic</v-app-bar-title>

    <v-spacer/>

    <v-btn to="/plants">Pflanzen</v-btn>
    <v-btn to="/settings">Einstellungen</v-btn>

    <AuthButton/>
  </v-app-bar>
</template>

<style scoped lang="sass">

</style>
