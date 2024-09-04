import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading: Ref<boolean> = ref(false)

  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  return { isLoading, startLoading, stopLoading }
})
