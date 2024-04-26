<script setup lang="ts">
import { type CardSet } from '@/stores/cardSet'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  data: CardSet
}>()
</script>
<template>
  <router-link
    :to="`/card-set/${props.data.id}`"
    class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
  >
    <div class="flex flex-col justify-between p-4 leading-normal w-full">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
        {{ props.data.title }}
      </h5>
      <span
        class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit"
        >{{ `${props.data.cards.length} terms` }}</span
      >
    </div>
  </router-link>
</template>
