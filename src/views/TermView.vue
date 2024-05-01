<script setup lang="ts">
import { FwbHeading, FwbButton } from 'flowbite-vue'
import { useRoute } from 'vue-router'
import { ref, type Ref, onMounted } from 'vue'
import { Modal } from 'flowbite'
import type { ModalInterface } from 'flowbite'

import { useCardSetStore, type CardSet } from '@/stores/cardSet'
import ExampleCard from '@/components/ExampleCard.vue'
import AddExampleModal from '@/components/AddExampleModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import getCurrentCardSet from '@/utils/currentCardSet'

const route = useRoute()
const exampleIdToDelete = ref(0)
const { selectedCard, deleteExampleInCard } = useCardSetStore()
const currentCardset: Ref<CardSet> = ref(getCurrentCardSet(route.params.cardSetId))
const deleteExampleModal: Ref<ModalInterface | null> = ref(null)
const addExampleModal: Ref<ModalInterface | null> = ref(null)

onMounted(() => {
  deleteExampleModal.value = new Modal(document.getElementById('delete-example-modal'), {
    placement: 'center',
  })
  addExampleModal.value = new Modal(document.getElementById('add-example-modal'), {
    placement: 'center',
  })
})

function toggleAddExampleModal() {
  addExampleModal.value?.toggle()
}

function toggleDeleteExampleModal() {
  deleteExampleModal.value?.toggle()
}

function handleDeleteExample() {
  try {
    deleteExampleInCard(exampleIdToDelete.value, currentCardset.value.id)
  } catch (error) {
    console.log(error)
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
            :to="`/card-set/${currentCardset.id}`"
            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >{{ currentCardset.title }}</router-link
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
          <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{
            route.params.term
          }}</span>
        </div>
      </li>
    </ol>
    <div class="flex justify-between">
      <fwb-heading tag="h2" class="truncate">{{ selectedCard.term }}</fwb-heading>
      <fwb-button @click="toggleAddExampleModal" class="hidden md:block"> Add example </fwb-button>
    </div>
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      {{ selectedCard.definition }}
    </p>
    <div class="flex justify-center md:hidden mt-6">
      <fwb-button @click="toggleAddExampleModal"> Add example </fwb-button>
    </div>
    <hr class="h-px mb-6 md:my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <fwb-heading tag="h4" class="mb-4">Examples</fwb-heading>
    <ul v-if="selectedCard">
      <ExampleCard
        v-for="example in selectedCard.examples"
        :key="example.id"
        :example="example"
        @delete="id => (exampleIdToDelete = id)"
        :toggleDeleteExampleModal="toggleDeleteExampleModal"
      />
    </ul>
    <AddExampleModal :toggleModal="toggleAddExampleModal" />
    <DeleteModal
      :handleDeleteFunction="handleDeleteExample"
      :toggleModal="toggleDeleteExampleModal"
      :message="'Are you sure you want to delete this example?'"
    />
  </div>
</template>
