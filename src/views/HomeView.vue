<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import { useCardSetStore, type CardSet } from '@/stores/cardSet'
import TermsCard from '@/components/TermsCard.vue'

const route = useRoute()
const router = useRouter()
const { cardSets } = useCardSetStore()
const searchQuery = ref('')
const filteredCardSets = ref([...cardSets])

function updateRouteWithSearchQuery() {
  if (searchQuery.value) {
    router.push(`/?search_query=${searchQuery.value.trim()}`)
  }
}

watch(
  () => route.query,
  (newQuery: LocationQuery) => {
    if (newQuery.search_query && typeof newQuery.search_query === 'string') {
      const lowerCasedQuery = newQuery.search_query.toLocaleLowerCase()
      filteredCardSets.value = cardSets.filter((cardSet: CardSet) =>
        cardSet.title.toLocaleLowerCase().includes(lowerCasedQuery),
      )
      searchQuery.value = newQuery.search_query
    } else {
      searchQuery.value = ''
      filteredCardSets.value = [...cardSets]
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-4 md:mt-8 md:p-2">
    <fwb-heading tag="h1">Card sets</fwb-heading>
    <div class="my-8 md:my-4">
      <div class="w-full flex">
        <input
          type="search"
          id="search-dropdown"
          class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-s-lg border-s-gray-50 border-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Search with a keyword"
          v-model="searchQuery"
          @keydown.enter="updateRouteWithSearchQuery"
        />
        <button
          type="button"
          @click="updateRouteWithSearchQuery"
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
      </div>
    </div>
    <ul class="card-sets-list">
      <li v-for="cardSet in filteredCardSets" class="mb-2 md:mb-0" :key="cardSet.id">
        <TermsCard :data="cardSet" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.card-sets-list {
  @apply md:grid md:grid-cols-2 md:gap-4;
}
</style>
