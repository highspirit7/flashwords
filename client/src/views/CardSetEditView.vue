<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref, computed, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useToasterStore } from '@/stores/toaster'
import { useCardsetStore } from '@/stores/cardsets'
import { useCardStore } from '@/stores/cards'
import { authTrpc } from '@/trpc'
import { assertError } from '@/utils/errors'

const route = useRoute()
const router = useRouter()
// const loading = ref(false)
const hasSubmittedOnce = ref(false)
const { selectedCardset } = storeToRefs(useCardsetStore())
const { setCardsInSelectedCardset, addEmptyCard, removeCard } = useCardStore()
const { cardsInSelectedCardset } = storeToRefs(useCardStore())
const { setSelectedCardset } = useCardsetStore()
const toasterStore = useToasterStore()

onMounted(async () => {
  const cardsetId = Number(route.params.id)
  if (cardsInSelectedCardset.value.length < 1) setCardsInSelectedCardset(cardsetId)

  if (selectedCardset.value.id === 0) setSelectedCardset(cardsetId)
})

// TODO
// 현재 포커싱된 카드 데이터를 위한 상태 필요
// 포커스 없어질 때 자동적으로 서버로 호출
// 포커스가 유지된(작업중인 카드가 있는) 상황에서 돌아가기 버튼 누르면 아마도 포커스가 알아서 아웃되면서 서버로 호출이 되지 않을까 싶은데 작업하면서 테스트 필요
// 서버에서 업데이트, 삭제 호출할때마다 토스트 띄워주기(에러 나는 경우에만)

const hasAtLeastOneFilledCard = computed(() => {
  if (cardsInSelectedCardset.value.length > 0) {
    const { term, definition } = cardsInSelectedCardset.value[0]
    return term.trim() !== '' && definition.trim() !== ''
  }
  return false
})

// TODO : maybe better to show up a modal to confirm
function onClickBackToCardset() {
  hasSubmittedOnce.value = true

  if (selectedCardset.value.title !== '' && hasAtLeastOneFilledCard.value) {
    router.replace({ name: 'cardset', params: { id: selectedCardset.value.id } })
  }
}

async function onBlurCardInput(record: { term?: string; definition?: string }, cardId: number) {
  try {
    await authTrpc.card.update.mutate({ record, cardId })
  } catch (error) {
    assertError(error)
    toasterStore.danger({ text: error.message })
  }
}

async function onBlurCardsetInput(
  record: { title?: string; description?: string },
  cardsetId: number,
) {
  if ('title' in record && record.title === '') return

  try {
    await authTrpc.cardset.update.mutate({ record, cardsetId })
  } catch (error) {
    assertError(error)
    toasterStore.danger({ text: error.message })
  }
}

async function onClickAddCard() {
  await addEmptyCard(selectedCardset.value.id)
  await nextTick()
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

async function onClickTrashBinIcon(cardId: number) {
  await removeCard(cardId)
}
</script>

<template>
  <div class="md:mt-8 p-4 md:p-2">
    <div class="flex justify-between items-center">
      <fwb-button color="dark" outline @click="onClickBackToCardset">
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
      <!-- ? Not sure if this part is needed or not -->
      <!-- <fwb-p class="text-sm text-purple-600 dark:text-purple-400 italic"
        >**Every time you finish editing each information, it will be saved in real time to
        server.</fwb-p
      > -->
    </div>
    <div class="mt-8 mb-4">
      <fwb-input
        v-model="selectedCardset.title"
        label="Title"
        placeholder="Enter a title for this cards set"
        class="mb-2"
        :class="{ error: hasSubmittedOnce && selectedCardset.title.trim() === '' }"
        @blur="onBlurCardsetInput({ title: selectedCardset.title }, selectedCardset.id)"
      />

      <fwb-textarea
        v-model="selectedCardset.description"
        :rows="4"
        label="Description(Not required)"
        placeholder="Add a description"
        class="resize-none"
        @blur="onBlurCardsetInput({ description: selectedCardset.description }, selectedCardset.id)"
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
        v-for="(card, index) in cardsInSelectedCardset"
        :key="card.id"
      >
        <div class="flex justify-between items-center">
          <fwb-heading tag="h5">{{ index + 1 }}</fwb-heading>
          <button
            type="button"
            class="h-fit mx-2"
            data-modal-target="delete-example-modal"
            data-modal-toggle="delete-example-modal"
            @click="onClickTrashBinIcon(card.id)"
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
            @blur="onBlurCardInput({ term: card.term }, card.id)"
          />
          <fwb-input
            v-model="card.definition"
            label="Definition"
            class="w-full"
            :class="{ error: hasSubmittedOnce && card.definition.trim() === '' && index < 1 }"
            data-testid="definition-input--edit"
            @blur="onBlurCardInput({ definition: card.definition }, card.id)"
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
