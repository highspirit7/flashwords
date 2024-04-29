<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref, type Ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter, useRoute } from 'vue-router'

import PlusDarkSvg from '@/assets/plus-dark.svg'
import type { CardSet, Card } from '@/stores/cardSet'
import getCurrentCardSet from '@/utils/currentCardSet'
import { useCardSetStore } from '@/stores/cardSet'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const hasSubmittedOnce = ref(false)
const { updateCardSet } = useCardSetStore()
const currentCardSet: Ref<CardSet> = ref(getCurrentCardSet(route.params.id))

// ! 스프레드연산자 사용해서 얕은 복사로 해도 cards는 그대로 같은 레퍼런스로 연결되어 있다.
// ! 스프레드 연산자마저 사용하지 않으면 모든 데이터가 cardSets 데이터와 동기화되어있다.
// ! 이러한 상황에서 Done 버튼 안 누르고 그냥 뒤로 가면 문제가 생긴다..
// 카드셋 하나 가져오는 경우에 로컬스토리지의 cardSets에서 가져와야하지 않나..싶다

const hasAtLeastOneFilledCard = computed(() => {
  if (!hasSubmittedOnce.value) return true

  if (currentCardSet.value.cards.length > 0) {
    const { term, definition } = currentCardSet.value.cards[0]
    return term.trim() !== '' && definition.trim() !== ''
  }
  return true
})

function onEditingDone() {
  hasSubmittedOnce.value = true
  loading.value = true

  try {
    updateCardSet({ ...currentCardSet.value, updatedAt: new Date() })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    router.push({ name: 'cardSet', params: { id: currentCardSet.value.id } })
  }
}

function addCard() {
  currentCardSet.value.cards.push({
    id: uuidv4(),
    term: '',
    definition: '',
    examples: [],
  })
}

function handleClickTrashBinIcon(cardId: string) {
  currentCardSet.value.cards = currentCardSet.value.cards.filter((card: Card) => card.id !== cardId)
}
</script>

<template>
  <div class="mt-8 p-2">
    <div class="flex justify-between">
      <fwb-button outline @click="$router.go(-1)">Back to card set</fwb-button>
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
      v-if="!hasAtLeastOneFilledCard"
    >
      <span>You must have at least 1 card with a term and a definition!</span>
    </div>

    <ul>
      <li
        class="bg-white p-4 rounded-lg my-1"
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
