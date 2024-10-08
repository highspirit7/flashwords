<script setup lang="ts">
import { FwbHeading, FwbSpinner } from 'flowbite-vue'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

import { useCardsetStore } from '@/stores/cardsets'
import TermsCard from '@/components/TermsCard.vue'
import type { CardsetPublic } from '@server/shared/types'
import { assertError } from '@/utils/errors'
import { useToasterStore } from '@/stores/toaster'
import { useLoadingStore } from '@/stores/loading'

const route = useRoute()
const router = useRouter()
const toasterStore = useToasterStore()

const { isLoading } = storeToRefs(useLoadingStore())
const { startLoading, stopLoading } = useLoadingStore()
const { setCardsets, setFilteredCardsets, resetFilteredCardsets } = useCardsetStore()

const { cardsets, filteredCardsets } = storeToRefs(useCardsetStore())
const searchQuery = ref('')

function updateRouteWithSearchQuery() {
  if (searchQuery.value) {
    router.push(`/cardsets?search_query=${searchQuery.value.trim()}`)
  }
}

onMounted(async () => {
  try {
    startLoading()
    await setCardsets()
  } catch (error) {
    assertError(error)
    toasterStore.danger({ text: 'Failed to fetch cardsets data. Please Try again later.' })
  } finally {
    stopLoading()
  }
})

watch(
  () => route.query,
  (newQuery: LocationQuery) => {
    if (newQuery.search_query && typeof newQuery.search_query === 'string') {
      const lowerCasedQuery = newQuery.search_query.toLocaleLowerCase()
      const filtered = cardsets.value.filter((cardSet: CardsetPublic) =>
        cardSet.title.toLocaleLowerCase().includes(lowerCasedQuery),
      )

      setFilteredCardsets(filtered)
      searchQuery.value = newQuery.search_query
    } else {
      searchQuery.value = ''
      resetFilteredCardsets()
    }
  },
)
</script>

<template>
  <div class="p-4 md:pt-10 md:p-2 h-full flex flex-col">
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
          autocomplete="off"
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
    <div v-if="!isLoading">
      <ul class="card-sets-list" v-if="filteredCardsets.length > 0">
        <li v-for="cardset in filteredCardsets" class="mb-2 md:mb-0" :key="cardset.id">
          <TermsCard :data="cardset" data-testid="terms-card" />
        </li>
      </ul>
      <div v-else class="mt-16">
        <fwb-heading tag="h5" class="text-gray-500 text-center"
          >No card sets.. <br />
          Please click a plus button to create your first card set.
        </fwb-heading>
      </div>
    </div>
    <div v-else class="flex items-center justify-center grow">
      <fwb-spinner size="10" />
    </div>
  </div>
</template>
<style scoped>
.card-sets-list {
  @apply md:grid md:grid-cols-2 md:gap-4;
}
</style>
