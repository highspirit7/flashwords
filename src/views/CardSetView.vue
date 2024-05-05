<script setup lang="ts">
import { FwbHeading, FwbButton } from 'flowbite-vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ref, type Ref, onMounted } from 'vue'
import { initFlowbite, Modal, Dropdown } from 'flowbite'
import type { ModalInterface, DropdownInterface } from 'flowbite'

import { type CardSet } from '@/stores/cardSet'
import TermCard from '@/components/TermCard.vue'
import getCurrentCardSet from '@/utils/currentCardSet'
import { useCardSetStore } from '@/stores/cardSet'
import TermFlashcard from '@/components/TermFlashcard.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import { useToasterStore } from '@/stores/toaster'
import useFlashcardStore from '@/stores/flashcard'

const route = useRoute()
const router = useRouter()
const { updateCardSet, deleteCardSet } = useCardSetStore()
const toasterStore = useToasterStore()
const flashcardStore = useFlashcardStore()
const currentFlashCardIndex = ref(1)
const currentCardSet: Ref<CardSet> = ref(getCurrentCardSet(route.params.id))
const deleteExampleModal: Ref<ModalInterface | null> = ref(null)
const dropdown: Ref<DropdownInterface | null> = ref(null)

onMounted(() => {
  initFlowbite()
  deleteExampleModal.value = new Modal(document.getElementById('delete-modal'), {
    placement: 'center',
  })
  dropdown.value = new Dropdown(
    document.getElementById('dropdownDotsHorizontal'),
    document.getElementById('dropdownMenuIconHorizontalButton'),
  )
})

function toggleDeleteModal() {
  deleteExampleModal.value?.toggle()
  dropdown.value?.hide()
}

function handleClickFlashCardNext() {
  if (currentFlashCardIndex.value === currentCardSet.value.cards.length) {
    currentFlashCardIndex.value = 1
  } else {
    currentFlashCardIndex.value += 1
  }

  flashcardStore.$reset()
}

function handleClickFlashCardPrev() {
  if (currentFlashCardIndex.value === 1) {
    currentFlashCardIndex.value = currentCardSet.value.cards.length
  } else if (currentCardSet.value.cards.length > 1) {
    currentFlashCardIndex.value -= 1
  }

  flashcardStore.$reset()
}

function handleDeleteCardSet() {
  try {
    deleteCardSet(currentCardSet.value.id)
    toasterStore.success({ text: 'Successfully deleted' })
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      toasterStore.danger({ text: error.message })
    }
  } finally {
    toggleDeleteModal()
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
            :to="`/card-set/${route.params.id}`"
            class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >{{ currentCardSet.title }}</router-link
          >
        </div>
      </li>
    </ol>
    <div class="flex justify-between">
      <fwb-heading class="mb-4" tag="h2" data-testid="cardset-title">{{
        currentCardSet.title
      }}</fwb-heading>
      <fwb-button
        color="alternative"
        size="sm"
        id="dropdownMenuIconHorizontalButton"
        data-dropdown-toggle="dropdownDotsHorizontal"
        class="h-fit p-2"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path
            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
          />
        </svg>
      </fwb-button>

      <!-- Dropdown menu -->
      <div
        id="dropdownDotsHorizontal"
        class="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-800 dark:divide-gray-600"
      >
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton"
        >
          <li>
            <button
              type="button"
              class="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white text-left"
              @click="toggleDeleteModal"
              data-modal-target="delete-modal"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
    <p class="text-gray-500 dark:text-gray-400 mb-8">
      {{ currentCardSet.description }}
    </p>

    <div id="flashcards-carousel" class="relative w-full mb-16" data-carousel="static">
      <!-- Carousel wrapper -->
      <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
        <div
          class="hidden duration-700 ease-in-out"
          data-carousel-item
          v-for="card in currentCardSet.cards"
          :key="card.id"
        >
          <TermFlashcard :card="card" />
        </div>
      </div>
      <!-- Slider controls -->
      <div
        class="absolute -bottom-12 left-1/2 -translate-x-2/4 w-52 flex justify-between items-center"
      >
        <button
          type="button"
          class="flex items-center justify-center px-4 cursor-pointer focus:outline-none"
          data-carousel-prev
          @click="handleClickFlashCardPrev"
        >
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800 hover:bg-white/50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-white dark:focus:ring-gray-800/70 focus:outline-none text-gray dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              class="w-4 h-4 rtl:rotate-180"
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
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span class="sr-only">Previous</span>
          </span>
        </button>
        <div class="text-xl font-semibold dark:text-gray-400">
          {{ `${currentFlashCardIndex} / ${currentCardSet.cards.length}` }}
        </div>
        <button
          type="button"
          class="flex items-center justify-center px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
          @click="handleClickFlashCardNext"
        >
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800 hover:bg-white/50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-white dark:focus:ring-gray-800/70 focus:outline-none text-gray dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              class="w-4 h-4 rtl:rotate-180"
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
            <span class="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>

    <ul class="my-4">
      <TermCard
        v-for="card in currentCardSet.cards"
        :key="card.id"
        :card="card"
        @finish-editing="() => updateCardSet({ ...currentCardSet, updatedAt: new Date() })"
      />
    </ul>
    <div class="flex justify-center mb-4">
      <fwb-button outline square @click="router.push(`${route.path}/edit`)">
        Add or Remove terms
        <template #suffix>
          <svg
            class="w-[20px] h-[20px]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </template>
      </fwb-button>
    </div>
    <DeleteModal
      :handleDeleteFunction="handleDeleteCardSet"
      :toggleModal="toggleDeleteModal"
      :message="`Are you sure you want to delete this card set(${currentCardSet.title})`"
    />
  </div>
</template>
