<script setup lang="ts">
const props = defineProps<{
  title: string
  numberOfCards: number
}>()
</script>
<template>
  <a
    href="#"
    class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
  >
    <div class="flex flex-col justify-between p-4 leading-normal w-full">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
        {{ props.title }}
      </h5>
      <span
        class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit"
        >{{ `${props.numberOfCards} terms` }}</span
      >
    </div>
  </a>
</template>
