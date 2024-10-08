<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import { storeToRefs } from 'pinia'
import { onMounted, type Ref, ref } from 'vue'
import { authTrpc } from '@/trpc'
import useFlashcardStore from '@/stores/flashcard'
import type { CardPublic, ExamplePublic } from '@server/shared/types'

const props = defineProps<{ card: CardPublic }>()
const examples: Ref<ExamplePublic[]> = ref([])

onMounted(async () => {
  examples.value = await authTrpc.example.findAllByCardId.query({ cardId: props.card.id })
})

const { isFlipped, isHintShown } = storeToRefs(useFlashcardStore())
const { toggleIsFlipped, toggleIsHintShown } = useFlashcardStore()
</script>
<template>
  <div class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
    <div
      class="flashcard-container"
      @click="toggleIsFlipped"
      @keydown.space="toggleIsFlipped"
      tabindex="0"
    >
      <div class="flashcard" :class="{ 'flashcard-flipped': isFlipped }" data-testid="flashcard">
        <div class="question flex justify-center items-center relative">
          <fwb-button
            color="alternative"
            @click.stop="toggleIsHintShown"
            class="focus:ring-0 absolute top-4 left-6 md:left-10"
            pill
            size="xs"
            v-if="examples.length > 0"
          >
            <template #prefix>
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
                  d="M7.05 4.05A7 7 0 0 1 19 9c0 2.407-1.197 3.874-2.186 5.084l-.04.048C15.77 15.362 15 16.34 15 18a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1c0-1.612-.77-2.613-1.78-3.875l-.045-.056C6.193 12.842 5 11.352 5 9a7 7 0 0 1 2.05-4.95ZM9 21a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm1.586-13.414A2 2 0 0 1 12 7a1 1 0 1 0 0-2 4 4 0 0 0-4 4 1 1 0 0 0 2 0 2 2 0 0 1 .586-1.414Z"
                  clip-rule="evenodd"
                />
              </svg>
            </template>
            <span v-if="!isHintShown">Get a hint(example)</span
            ><span v-else class="underline decoration-sky-600 font-semibold italic">{{
              examples[Math.floor(Math.random() * examples.length)].content
            }}</span></fwb-button
          >
          <div
            class="text-5xl leading-normal dark:text-white w-full px-16 truncate"
            data-testid="flashcard-term"
          >
            {{ props.card.term }}
          </div>
        </div>
        <div class="answer flex justify-center items-center">
          <div
            class="text-5xl dark:text-white w-full px-16 truncate"
            data-testid="flashcard-definition"
          >
            {{ props.card.definition }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.flashcard-container .flashcard-flipped {
  transform: rotateY(180deg);
}

.flashcard-container,
.question,
.answer {
  @apply w-full h-56 md:h-96 cursor-pointer;
}

.flashcard-container:focus-visible {
  outline: none;
}

.flashcard {
  transition: 0.5s;
  transform-style: preserve-3d;
}

.question {
  z-index: 5;
}

.answer {
  transform: rotateY(180deg);
}

.question,
.answer {
  @apply bg-white rounded-xl text-center border-4 border-blue-700;
  @apply absolute top-0 left-0;
  @apply dark:bg-gray-900 dark:border-blue-500;

  backface-visibility: hidden;
}
</style>
