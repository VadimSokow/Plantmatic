<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-text-field label="Benutzername"></v-text-field>
            <v-text-field label="Passwort" type="password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">Einloggen</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useAuthStore} from "@/stores/auth.ts";

definePage({
  meta: {
    layout: 'login',
  },
})

const router = useRouter();
const authStore = useAuthStore();

const login = () => {
  authStore.loginDummy();
  router.push('/plants');
};
</script>
