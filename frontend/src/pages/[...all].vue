<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" sm="8">
        <v-card class="mx-auto mt-5">
          <v-card-title class="text-h4">
            Seite nicht gefunden
          </v-card-title>
          <v-card-text>
            <!-- TODO: Support Kontakt einfügen -->
            Die angeforderte Seite konnte nicht gefunden werden. Bitte wenden Sie sich an den Support.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="router.push('/')">
              Zur Startseite
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>
