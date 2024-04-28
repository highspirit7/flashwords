import { defineStore } from 'pinia'
import { ref } from 'vue'

const useModalStore = defineStore('modal', () => {
  const isShowModal = ref(false)

  function closeModal() {
    isShowModal.value = false
  }
  function showModal() {
    isShowModal.value = true
  }

  return { isShowModal, closeModal, showModal }
})

export default useModalStore
