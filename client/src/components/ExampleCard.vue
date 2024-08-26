<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref, type Ref } from 'vue'

import { isHTMLInputElement } from '@/utils/typePredicates'
import type { ExamplePublic } from '@server/shared/types'
import { useExampleStore } from '@/stores/examples'

const isEditing = ref(false)
const target: Ref<HTMLLIElement | null> = ref(null)
const props = defineProps<{
  example: ExamplePublic
  toggleDeleteExampleModal: () => void
}>()
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()
const { example, toggleDeleteExampleModal } = props
const { updateExample } = useExampleStore()

function handleFinishEditing() {
  isEditing.value = false

  updateExample(example.content, example.id)
}

function handleClickTrashBinIcon() {
  toggleDeleteExampleModal()
  emit('delete', example.id)
}

onClickOutside(target, () => {
  if (isEditing.value) {
    handleFinishEditing()
  }
})
</script>
<template>
  <li class="bg-white dark:bg-gray-900 p-2 md:p-4 rounded-lg my-2" ref="target">
    <div class="flex items-center">
      <input
        type="text"
        id="floating_standard"
        class="block py-2.5 px-0 me-4 w-full text-sm text-gray-900 dark:text-white bg-transparent border-0 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        :value="example.content"
        @input="
          (event: Event) => {
            if (isHTMLInputElement(event.target)) {
              example.content = event.target.value
            }
          }
        "
        :class="{ 'border-b-2': isEditing }"
        :disabled="!isEditing"
        @keydown.enter="handleFinishEditing"
      />
      <!-- TODO : Give focus on input -->
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
      <button
        type="button"
        class="h-fit mx-2"
        data-modal-target="delete-modal"
        @click="handleClickTrashBinIcon"
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
  </li>
</template>
