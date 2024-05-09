<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref, type Ref, computed, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useRoute } from 'vue-router'

import type { CardSet, Card } from '@/stores/cardSet'
import { getCurrentCardSet } from '@/utils/currentCardSet'
import { useCardSetStore } from '@/stores/cardSet'
import { useToasterStore } from '@/stores/toaster'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const hasSubmittedOnce = ref(false)
const { updateCardSet } = useCardSetStore()
const toasterStore = useToasterStore()
const currentCardSet: Ref<CardSet> = ref(getCurrentCardSet(route.params.id))

const hasAtLeastOneFilledCard = computed(() => {
  if (currentCardSet.value.cards.length > 0) {
    const { term, definition } = currentCardSet.value.cards[0]
    return term.trim() !== '' && definition.trim() !== ''
  }
  return false
})

function onEditingDone() {
  hasSubmittedOnce.value = true

  if (currentCardSet.value.title !== '' && hasAtLeastOneFilledCard.value) {
    loading.value = true

    try {
      updateCardSet({ ...currentCardSet.value, updatedAt: new Date() })
      toasterStore.success({ text: 'This card set was successfully editted!' })
      router.push({ name: 'cardSet', params: { id: currentCardSet.value.id } })
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

async function onClickAddCard() {
  currentCardSet.value.cards.push({
    id: uuidv4(),
    term: '',
    definition: '',
    examples: [],
  })

  await nextTick()
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function handleClickTrashBinIcon(cardId: string) {
  currentCardSet.value.cards = currentCardSet.value.cards.filter((card: Card) => card.id !== cardId)
}
</script>

<template>
  <div class="md:mt-8 p-4 md:p-2">
    <div class="flex justify-between">
      <fwb-button color="dark" outline @click="$router.go(-1)">
        <template #prefix>
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
              d="m15 19-7-7 7-7"
            />
          </svg>
        </template>
        Back to card set</fwb-button
      >
      <fwb-button size="md" :disabled="loading" :loading="loading" @click="onEditingDone"
        >Done</fwb-button
      >
    </div>
    <div class="mt-8 mb-4">
      <fwb-input
        v-model="currentCardSet.title"
        label="Title"
        placeholder="Enter a title for this cards set"
        class="mb-2"
        :class="{ error: hasSubmittedOnce && currentCardSet.title.trim() === '' }"
      />

      <fwb-textarea
        v-model="currentCardSet.description"
        :rows="4"
        label="Description(Not required)"
        placeholder="Add a description"
        class="resize-none"
      />
    </div>

    <div
      class="bg-white text-lg font-semibold text-red-500 rounded-lg mb-4 border-red-500 border-2 p-3 w-full flex justify-center"
      v-if="!hasAtLeastOneFilledCard && hasSubmittedOnce"
    >
      <span>You must have at least 1 card with a term and a definition!</span>
    </div>

    <ul>
      <li
        class="bg-white dark:bg-gray-900 p-4 rounded-lg my-2"
        v-for="(card, index) in currentCardSet.cards"
        :key="card.id"
      >
        <div class="flex justify-between items-center">
          <fwb-heading tag="h5">{{ index + 1 }}</fwb-heading>
          <button
            type="button"
            class="h-fit mx-2"
            data-modal-target="delete-example-modal"
            data-modal-toggle="delete-example-modal"
            @click="() => handleClickTrashBinIcon(card.id)"
            v-if="index > 0"
          >
            <svg
              class="w-[18px] h-[18px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="sr-only">Trash Bin Icon</span>
          </button>
        </div>
        <hr class="mb-2" />
        <div class="grid grid-cols-2 gap-4">
          <fwb-input
            v-model="card.term"
            label="Term"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.term.trim() === '' && index < 1 }"
            data-testid="term-input--edit"
          />
          <fwb-input
            v-model="card.definition"
            label="Definition"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.definition.trim() === '' && index < 1 }"
            data-testid="definition-input--edit"
          />
        </div>
      </li>
    </ul>
    <div class="flex justify-center p-4 my-4 bg-white dark:bg-gray-900 rounded-lg">
      <fwb-button color="light" pill @click="onClickAddCard" class="dark:hover:bg-gray-700">
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
