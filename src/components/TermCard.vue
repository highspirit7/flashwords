<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref, type Ref } from 'vue'

import { type Card } from '@/stores/cardSet'
import { useCardSetStore } from '@/stores/cardSet'

const isEditing = ref(false)
const target: Ref<HTMLLIElement | null> = ref(null)
const props = defineProps<{ card: Card }>()
const { card } = props
const { saveInLocalStorage } = useCardSetStore()

// ? The card data used in this component share the same reference of card data in cardSets data by pinia. So no need to create another function to update card data in cardSet store file.
// ? But is this way okay?
function handleFinishEditing() {
  isEditing.value = false
  saveInLocalStorage()
}

onClickOutside(target, () => {
  handleFinishEditing()
})

function isHTMLInputElement(
  targetElement: EventTarget | null | HTMLInputElement,
): targetElement is HTMLInputElement {
  return (targetElement as HTMLInputElement).value !== undefined
}
</script>
<template>
  <li class="bg-white p-4 rounded-lg my-1" ref="target">
    <div class="flex items-center">
      <input
        type="text"
        id="floating_standard"
        class="block py-2.5 px-0 me-4 w-2/5 text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        :value="card.term"
        @input="
          (event: Event) => {
            if (isHTMLInputElement(event.target)) {
              card.term = event.target.value
            }
          }
        "
        :class="{ 'border-b-2': isEditing, 'border-e-2': !isEditing }"
        :disabled="!isEditing"
        @keydown.enter="handleFinishEditing"
      />
      <input
        type="text"
        id="floating_standard"
        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        :value="card.definition"
        @input="
          (event: Event) => {
            if (isHTMLInputElement(event.target)) {
              card.definition = event.target.value
            }
          }
        "
        :class="{ 'border-b-2': isEditing }"
        :disabled="!isEditing"
        @keydown.enter="handleFinishEditing"
      />
      <button type="button" class="h-fit mx-2" @click="isEditing = !isEditing">
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
            d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
            clip-rule="evenodd"
          />
        </svg>

        <span class="sr-only">Edit Icon</span>
      </button>
      <button type="button" class="h-fit mx-2">
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
            d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only">Go into a term Icon</span>
      </button>
    </div>
  </li>
</template>
