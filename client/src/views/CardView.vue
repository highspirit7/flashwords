<script setup lang="ts">
import { FwbHeading, FwbButton } from 'flowbite-vue'
import { useRoute } from 'vue-router'
import { ref, type Ref, onMounted } from 'vue'
import { Modal } from 'flowbite'
import type { ModalInterface } from 'flowbite'
import { storeToRefs } from 'pinia'

import { useToasterStore } from '@/stores/toaster'
import { useCardsetStore } from '@/stores/cardsets'
import ExampleCard from '@/components/ExampleCard.vue'
import AddExampleModal from '@/components/AddExampleModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import { useCardStore } from '@/stores/cards'
import { useExampleStore } from '@/stores/examples'
import { assertError } from '@/utils/errors'
import { getSafeUrlParams } from '@/utils/url'

const route = useRoute()
const toasterStore = useToasterStore()
const { selectedCardset } = storeToRefs(useCardsetStore())
const { selectedCard } = storeToRefs(useCardStore())
const { examplesInSelectedCard } = storeToRefs(useExampleStore())
const { setSelectedCardset } = useCardsetStore()
const { setSelectedCard } = useCardStore()
const { setExamplesInSelectedCard, deleteExample } = useExampleStore()
const exampleIdToDelete = ref(0)
const deleteExampleModal: Ref<ModalInterface | null> = ref(null)
const addExampleModal: Ref<ModalInterface | null> = ref(null)

onMounted(async () => {
  deleteExampleModal.value = new Modal(document.getElementById('delete-modal'), {
    placement: 'center',
  })
  addExampleModal.value = new Modal(document.getElementById('add-example-modal'), {
    placement: 'center',
  })

  if (selectedCardset.value.id === 0) await setSelectedCardset(Number(route.params.cardsetId))
  await setSelectedCard(Number(route.params.cardId))

  setExamplesInSelectedCard(Number(route.params.cardId))
})

function toggleAddExampleModal() {
  addExampleModal.value?.toggle()
}

function toggleDeleteExampleModal() {
  deleteExampleModal.value?.toggle()
}

function handleDeleteExample() {
  try {
    deleteExample(exampleIdToDelete.value)

    toasterStore.success({ text: 'Successfully deleted' })
  } catch (error) {
    assertError(error)
    toasterStore.danger({ text: 'Failed to delete an example, Try again later' })
  } finally {
    toggleDeleteExampleModal()
  }
}
</script>
<template>
  <div class="p-4 md:p-2">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse mb-4">
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
            :to="`/${getSafeUrlParams(selectedCardset.title)}/${selectedCardset.id}`"
            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white max-w-40 truncate"
            >{{ selectedCardset.title }}</router-link
          >
        </div>
      </li>
      <li aria-current="page">
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
          <span
            class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400 truncate max-w-48"
            >{{ selectedCard.term }}</span
          >
        </div>
      </li>
    </ol>
    <div class="flex justify-between">
      <fwb-heading tag="h2" class="truncate">{{ selectedCard.term }}</fwb-heading>
      <fwb-button @click="toggleAddExampleModal" class="hidden md:block ml-4">
        Add example
      </fwb-button>
    </div>
    <p class="text-gray-500 dark:text-gray-400 mt-2 truncate">
      {{ selectedCard.definition }}
    </p>
    <div class="flex justify-center md:hidden mt-6">
      <fwb-button @click="toggleAddExampleModal"> Add example </fwb-button>
    </div>
    <hr class="h-px mb-6 md:my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <fwb-heading tag="h4" class="mb-4">Examples</fwb-heading>
    <ul v-if="examplesInSelectedCard.length > 0">
      <ExampleCard
        v-for="example in examplesInSelectedCard"
        :key="example.id"
        :example="example"
        @delete="id => (exampleIdToDelete = id)"
        :toggleDeleteExampleModal="toggleDeleteExampleModal"
      />
    </ul>
    <div v-else class="mt-16">
      <fwb-heading tag="h6" class="text-center text-gray-500">No examples</fwb-heading>
    </div>
    <AddExampleModal :toggleModal="toggleAddExampleModal" />
    <DeleteModal
      :handleDeleteFunction="handleDeleteExample"
      :toggleModal="toggleDeleteExampleModal"
      :message="'Are you sure you want to delete this example?'"
    />
  </div>
</template>
