<template>
  <v-app-bar app>
    <div style="margin-left: 10px" />
    <v-icon icon="mdi-leaf" />
    <v-app-bar-title>Plantmatic</v-app-bar-title>

    <v-spacer />

    <v-btn to="/">Übersicht</v-btn>
    <!--
    <v-btn to="/devices/register">
      <v-icon icon="mdi-plus" />
      Gerät
    </v-btn>
    -->
    <Account />
  </v-app-bar>
</template>

<style scoped>
.v-btn {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
