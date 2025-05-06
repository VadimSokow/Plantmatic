<template>
  <v-btn type="primary" @click="logoutRedirect">Sign Out</v-btn>
</template>

<script setup lang="ts">
import { useMsal } from '../composition-api/useMsal';

const { instance } = useMsal();

const logoutPopup = () => {
  instance.logoutPopup({
    mainWindowRedirectUri: "/"
  });
}

const logoutRedirect = () => {
  instance.logoutRedirect();
}
</script>
