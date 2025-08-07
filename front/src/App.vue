<style scoped></style>
<template>
  <v-app>
    <AppHeader />
    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
</script>
