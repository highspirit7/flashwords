<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <header class="flex justify-center bg-white w-full">
    <Navbar />
  </header>
  <main class="max-w-3xl w-full py-4">
    <RouterView />
  </main>
</template>
