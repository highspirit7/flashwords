<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

// TODO : Need to use the code to extract the theme of OS later after handling styling for dark mode in all pages
if (localStorage.getItem('color-theme') === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  console.log('')
  document.documentElement.classList.remove('dark')
}
</script>

<template>
  <header class="flex justify-center bg-white w-full">
    <Navbar />
  </header>
  <main class="max-w-3xl w-full py-4">
    <RouterView />
  </main>
</template>
