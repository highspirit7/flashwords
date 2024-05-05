<script setup lang="ts">
import { RouterView } from 'vue-router'

import TopNavbar from '@/components/TopNavbar.vue'
import NotificationToaster from '@/components/NotificationToaster.vue'
import * as localStorage from '@/utils/localStorage'

if (
  localStorage.getItem('color-theme') === 'dark' ||
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
</script>

<template>
  <NotificationToaster />
  <header class="flex justify-center bg-white w-full sticky top-0 z-50 dark:bg-gray-900">
    <TopNavbar />
  </header>
  <main class="max-w-3xl w-full py-4">
    <RouterView />
  </main>
</template>
