<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref, type Ref, onMounted, computed, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'

import { useCardSetStore } from '@/stores/cardSet'
import { useToasterStore } from '@/stores/toaster'
import type { CardSet } from '@/stores/cardSet'

const loading = ref(false)
const hasSubmittedOnce = ref(false)
const newCardSet: Ref<CardSet> = ref({
  id: uuidv4(),
  title: '',
  description: '',
  createdAt: undefined,
  updatedAt: undefined,
  cards: [],
})
const { createCardSet } = useCardSetStore()
const toasterStore = useToasterStore()
const router = useRouter()

const hasAtLeastOneFilledCard = computed(() => {
  if (newCardSet.value.cards.length > 0) {
    const { term, definition } = newCardSet.value.cards[0]
    return term.trim() !== '' && definition.trim() !== ''
  }
  return false
})

async function onClickAddCard() {
  newCardSet.value.cards.push({
    id: uuidv4(),
    term: '',
    definition: '',
    examples: [],
  })

  await nextTick()
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

onMounted(() => {
  if (newCardSet.value.cards.length < 1) {
    onClickAddCard()
  }
})

function onSubmit() {
  hasSubmittedOnce.value = true

  if (newCardSet.value.title !== '' && hasAtLeastOneFilledCard.value) {
    loading.value = true
    newCardSet.value.updatedAt = new Date()
    newCardSet.value.createdAt = new Date()
    try {
      createCardSet(newCardSet.value)
      toasterStore.success({ text: 'You just created a new card set!' })
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        toasterStore.danger({ text: error.message })
      }
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="md:mt-8 p-4 md:p-2">
    <div class="flex justify-between">
      <fwb-heading tag="h1" class="text-4xl md:text-5xl">Create a new card set</fwb-heading>
      <fwb-button
        size="md"
        :disabled="loading"
        :loading="loading"
        @click="onSubmit"
        class="hidden md:block"
        >Create</fwb-button
      >
    </div>

    <div class="mt-8 mb-4">
      <fwb-input
        v-model="newCardSet.title"
        label="Title"
        placeholder="Enter a title for this cards set"
        class="mb-2"
        :class="{ error: hasSubmittedOnce && newCardSet.title.trim() === '' }"
      />

      <fwb-textarea
        v-model="newCardSet.description"
        :rows="4"
        label="Description(Not required)"
        placeholder="Add a description"
        class="resize-none"
      />
    </div>

    <div
      class="bg-white text-sm text-center md:text-lg font-semibold text-red-500 rounded-lg mb-4 border-red-500 border-2 p-3 w-full flex justify-center"
      v-if="hasSubmittedOnce && !hasAtLeastOneFilledCard"
    >
      <span>You must have at least 1 card with a term and a definition!</span>
    </div>

    <ul>
      <li
        class="bg-white dark:bg-gray-900 p-4 rounded-lg my-1"
        v-for="(card, index) in newCardSet.cards"
        :key="card.id"
      >
        <fwb-heading tag="h5">{{ index + 1 }}</fwb-heading>
        <hr class="mb-2" />
        <div class="grid grid-cols-2 gap-4">
          <fwb-input
            v-model="card.term"
            label="Term"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.term.trim() === '' && index < 1 }"
            data-testid="term-input"
          />
          <fwb-input
            v-model="card.definition"
            label="Definition"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.definition.trim() === '' && index < 1 }"
            data-testid="definition-input"
          />
        </div>
      </li>
    </ul>
    <div class="flex justify-center p-4 my-4 bg-white dark:bg-gray-900 rounded-lg">
      <fwb-button color="light" class="dark:hover:bg-gray-700" pill @click="onClickAddCard">
        Add a card
        <template #suffix>
          <svg
            class="w-[18px] h-[18px]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
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
    <div class="flex justify-center mt-4 md:hidden">
      <fwb-button size="lg" :disabled="loading" :loading="loading" @click="onSubmit"
        >Create</fwb-button
      >
    </div>
  </div>
</template>

<style scoped>
.error :deep(input) {
  @apply bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500;
}

.error :deep(label) {
  @apply text-red-700 dark:text-red-500;
}
</style>
