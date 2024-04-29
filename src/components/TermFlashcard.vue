<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import { ref } from 'vue'

import { type Card } from '@/stores/cardSet'

const props = defineProps<{ card: Card }>()
const isFlipped = ref(false)

function toggleIsFlipped() {
  isFlipped.value = !isFlipped.value
}
</script>
<template>
  <div class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
    <div
      class="flashcard-container"
      @click="toggleIsFlipped"
      @keydown.space="toggleIsFlipped"
      tabindex="0"
    >
      <div class="flashcard" :class="{ 'flashcard-flipped': isFlipped }">
        <div class="question flex justify-center items-center relative">
          <fwb-button class="absolute top-4 left-10" pill outline>
            <template #prefix>
              <svg
                class="w-[18px] h-[18px] text-gray-800 dark:text-white"
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
                  d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
                />
              </svg>
            </template>
            Get a hint
          </fwb-button>
          <div class="text-5xl">{{ props.card.term }}</div>
        </div>
        <div class="answer flex justify-center items-center">
          <div class="text-5xl">{{ props.card.definition }}</div>
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
  @apply w-full;

  height: 380px;
  cursor: pointer;
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

  backface-visibility: hidden;
}
</style>
