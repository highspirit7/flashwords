<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref, type Ref, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import { useCardSetStore } from '@/stores/cardSet'
import PlusDarkSvg from '@/assets/plus-dark.svg'
import type { CardSet } from '@/stores/cardSet'
import { useRouter } from 'vue-router'

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
const router = useRouter()

const hasAtLeastOneFilledCard = computed(() => {
  if (newCardSet.value.cards.length > 0) {
    const { term, definition } = newCardSet.value.cards[0]
    return term.trim() !== '' && definition.trim() !== ''
  }
  return false
})

function addCard() {
  newCardSet.value.cards.push({
    id: uuidv4(),
    term: '',
    definition: '',
    examples: [],
  })
}

onMounted(() => {
  if (newCardSet.value.cards.length < 1) {
    addCard()
  }
})

function onSubmit() {
  hasSubmittedOnce.value = true

  if (newCardSet.value.title !== '') {
    loading.value = true
    newCardSet.value.updatedAt = new Date()
    newCardSet.value.createdAt = new Date()
    try {
      createCardSet(newCardSet.value)
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
      router.push('/')
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
      class="bg-white text-lg font-semibold text-red-500 rounded-lg mb-4 border-red-500 border-2 p-3 w-full flex justify-center"
      v-if="hasSubmittedOnce && !hasAtLeastOneFilledCard"
    >
      <span>You must have at least 1 card with a term and a definition!</span>
    </div>

    <ul>
      <li
        class="bg-white p-4 rounded-lg my-1"
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
            :class="{ error: hasSubmittedOnce && card.term.trim() === '' }"
          />
          <fwb-input
            v-model="card.definition"
            label="Definition"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.definition.trim() === '' }"
          />
        </div>
      </li>
    </ul>
    <div class="flex justify-center p-4 my-4 bg-white rounded-lg">
      <fwb-button color="light" pill @click="addCard">
        Add a card
        <template #suffix>
          <PlusDarkSvg />
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
