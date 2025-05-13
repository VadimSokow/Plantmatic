<template>
  <v-btn v-if="!isAuth" color="primary" @click="login">Login</v-btn>
  <v-btn v-else color="secondary" @click="logout">Logout</v-btn>
</template>

<script setup lang="ts">
import {useMsal} from '../composition-api/useMsal';
import {loginRequest} from "../authConfig";
import {useIsAuthenticated} from "@/composition-api/useIsAuthenticated.ts";

const {instance} = useMsal();

const isAuth = useIsAuthenticated();

const login = () => instance.loginRedirect(loginRequest);
const logout = () => instance.logoutRedirect();
</script>
