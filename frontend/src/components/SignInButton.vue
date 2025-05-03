<template>
  <v-btn type="primary" @click="loginRedirect">Sign In</v-btn>
</template>

<script setup lang="ts">
import {useMsal} from '../composition-api/useMsal';
import {loginRequest} from "../authConfig";

const {instance} = useMsal();

const loginPopup = () => {
  instance.loginPopup(loginRequest);
}

const loginRedirect = () => {
  instance.loginRedirect(loginRequest);
}
</script>
