<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import { RouterLink, useRoute } from 'vue-router'

import { useCardSetStore } from '@/stores/cardSet'
import TermCard from '@/components/TermCard.vue'

function isString(variable: any): variable is string {
  return typeof variable === 'string'
}

const route = useRoute()
const { selectCardSet, selectedCardSet } = useCardSetStore()
if (isString(route.params.id)) {
  selectCardSet(route.params.id)
}
</script>

<template>
  <div class="p-2">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li class="inline-flex items-center">
        <router-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            class="w-3 h-3 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
            />
          </svg>
          Home
        </router-link>
      </li>
      <li>
        <div class="flex items-center">
          <svg
            class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <router-link
            :to="`/card-set/${route.params.id}`"
            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >{{ selectedCardSet.title }}</router-link
          >
        </div>
      </li>
    </ol>
    <fwb-heading tag="h2">{{ selectedCardSet.title }}</fwb-heading>
    <p class="text-gray-500 dark:text-gray-400">
      {{ selectedCardSet.description }}
    </p>

    <ul class="my-4">
      <TermCard v-for="card in selectedCardSet.cards" :key="card.id" :card="card" />
    </ul>
  </div>
</template>

<style scoped></style>
