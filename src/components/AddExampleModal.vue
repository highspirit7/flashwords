<script setup lang="ts">
import { ref } from 'vue'
import { FwbButton, FwbInput } from 'flowbite-vue'
import { useRoute } from 'vue-router'

import { isString } from '@/utils/typePredicates'
import { useCardSetStore } from '@/stores/cardSet'
import { useToasterStore } from '@/stores/toaster'

const route = useRoute()
const sentence = ref('')
const props = defineProps<{
  toggleModal: () => void
}>()
const { toggleModal } = props
const toasterStore = useToasterStore()
const { addExampleOfCard } = useCardSetStore()

function handleClickAdd() {
  if (isString(route.params.cardSetId)) {
    try {
      addExampleOfCard(sentence.value, route.params.cardSetId)
      toasterStore.success({ text: 'Successfully added an example!' })
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        toasterStore.danger({ text: error.message })
      }
    } finally {
      sentence.value = ''
      toggleModal()
    }
  }
}
</script>
<template>
  <div
    id="add-example-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">Add a new example</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="add-example-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <fwb-input v-model="sentence" placeholder="Type an example sentence" />
        </div>
        <!-- Modal footer -->
        <div
          class="flex justify-center items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <fwb-button @click="handleClickAdd"> Add </fwb-button>
        </div>
      </div>
    </div>
  </div>
</template>
