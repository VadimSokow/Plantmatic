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
  import { useMsal } from '../composition/msal'

  const { instance } = useMsal()

  const username = computed(() => {
    const account = instance.getAllAccounts()[0]
    console.log(account)
    if (!account.idTokenClaims) {
      return account.username.length === 0 ? 'unknown' : account.username
    }
    const mail = account.idTokenClaims['email']
    // check if mail is a string
    if (typeof mail === 'string') {
      return mail.length === 0 ? 'unknown' : mail
    }
    return 'unknown'
  })

  const logout = () => {
    if (instance.getAllAccounts().length === 0) {
      console.warn('No accounts available for logout.')
      alert('No accounts available for logout.')
      // redirect to login page
      window.location.href = '/login'
      return
    }
    instance.logoutRedirect()
  }
</script>
