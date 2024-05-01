<script setup lang="ts">
import { RouterView } from 'vue-router'

import TopNavbar from '@/components/TopNavbar.vue'
import * as localStorage from '@/utils/localStorage'
// TODO : Need to use the code to extract the theme of OS later after handling styling for dark mode in all pages
if (
  localStorage.getItem('color-theme') === 'dark' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
</script>

<template>
  <header class="flex justify-center bg-white w-full sticky top-0 z-50 dark:bg-gray-900">
    <TopNavbar />
  </header>
  <main class="max-w-3xl w-full py-4">
    <RouterView />
  </main>
</template>
