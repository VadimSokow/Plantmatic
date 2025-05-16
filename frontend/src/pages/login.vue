<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-4" max-width="400">
        <v-img
          src="@/assets/logo.svg"
          alt="Logo"
          class="mx-auto mb-4"
          width="150"
          height="150"
          contain
        />
        <h2 class="text-center mb-2">Plantmatic</h2>
        <p class="text-center mb-4">Anmelden um das Dashboard zu öffnen.</p>
        <v-btn @click="login()" color="primary" class="mx-auto d-block">Login</v-btn>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {useMsal} from '../composition-api/useMsal';
import {loginRequest} from "../authConfig";

const {instance} = useMsal();

definePage({
  meta: {
    layout: 'empty'
  }
})

const login = () => instance.loginRedirect(loginRequest);
</script>
