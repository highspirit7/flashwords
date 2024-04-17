<script setup lang="ts">
import { FwbHeading, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import TermsCard from '@/components/TermsCard.vue'

const mockCardsSet = [
  {
    title: 'Nederland in Gang : Chapter 1',
    numberOfCards: 22,
  },
  {
    title: 'Nederland in Gang : Chapter 2',
    numberOfCards: 12,
  },
  {
    title: 'Nederland in Actie : Chapter 1',
    numberOfCards: 44,
  },
  {
    title: 'Nederland in Actie : Chapter 2',
    numberOfCards: 22,
  },
  {
    title: 'Nederland in Gang : Chapter 3',
    numberOfCards: 56,
  },
]

const searchKeyword = ref('')
</script>

<template>
  <div class="mt-8 p-2">
    <fwb-heading tag="h1">Card sets</fwb-heading>
    <div class="my-4">
      <fwb-input v-model="searchKeyword" placeholder="Search">
        <template #prefix>
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
      </fwb-input>
    </div>
    <ul class="card-sets-list">
      <li v-for="cardSet in mockCardsSet" class="mb-2 md:mb-0">
        <TermsCard :title="cardSet.title" :number-of-cards="cardSet.numberOfCards" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.card-sets-list {
  @apply md:grid md:grid-cols-2 md:gap-4;
}
</style>
