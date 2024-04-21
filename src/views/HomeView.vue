<script setup lang="ts">
import { FwbHeading, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'

import { useCardSetStore } from '@/stores/cardSet'
import TermsCard from '@/components/TermsCard.vue'

const { cardSets } = useCardSetStore()
// const mockCardsSet = [
//   {
//     title: 'Nederland in Gang : Chapter 1',
//     numberOfCards: 22,
//   },
//   {
//     title: 'Nederland in Gang : Chapter 2',
//     numberOfCards: 12,
//   },
//   {
//     title: 'Nederland in Actie : Chapter 1',
//     numberOfCards: 44,
//   },
//   {
//     title: 'Nederland in Actie : Chapter 2',
//     numberOfCards: 22,
//   },
//   {
//     title: 'Nederland in Gang : Chapter 3',
//     numberOfCards: 56,
//   },
// ]

const searchKeyword = ref('')
</script>

<template>
  <div class="mt-8 p-2">
    <fwb-heading tag="h1">Card sets</fwb-heading>
    <div class="my-4">
      <div class="w-full flex">
        <input
          type="search"
          id="search-dropdown"
          class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-white rounded-s-lg border-s-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Search"
          required
        >
    
        <button
          type="submit"
          class="text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 px-2"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
    </input>
      </div>
      <!-- <fwb-input v-model="searchKeyword" placeholder="Search">
        <template #suffix>
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </template>
      </fwb-input> -->
    </div>
    <ul class="card-sets-list">
      <li v-for="cardSet in cardSets" class="mb-2 md:mb-0">
        <TermsCard :title="cardSet.title" :number-of-cards="cardSet.cards.length" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.card-sets-list {
  @apply md:grid md:grid-cols-2 md:gap-4;
}
</style>
