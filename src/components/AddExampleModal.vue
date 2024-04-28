<script setup lang="ts">
import { ref } from 'vue'
import { FwbModal, FwbButton, FwbInput } from 'flowbite-vue'
import { useRoute } from 'vue-router'

import { isString } from '@/utils/typePredicates'
import { useCardSetStore } from '@/stores/cardSet'
import useModalStore from '@/stores/modal'

const route = useRoute()
const sentence = ref('')
const isShowModal = ref(false)
const { addExampleOfCard } = useCardSetStore()
const modalStore = useModalStore()

modalStore.$subscribe((mutation, state) => {
  isShowModal.value = state.isShowModal
})

function onSubmit() {
  if (isString(route.params.cardSetId)) {
    addExampleOfCard(sentence.value, route.params.cardSetId)
    modalStore.closeModal()
    sentence.value = ''
  }
}
</script>
<template>
  <fwb-modal v-if="isShowModal" @close="modalStore.closeModal" size="md" class="abc">
    <template #header>
      <div class="flex items-center text-lg">Add a new example</div>
    </template>
    <template #body>
      <fwb-input v-model="sentence" placeholder="Type an example sentence" />
    </template>
    <template #footer>
      <div class="flex justify-center">
        <fwb-button @click="onSubmit"> Add </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
