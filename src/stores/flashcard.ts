import { ref } from 'vue'
import { defineStore } from 'pinia'

const useFlashcardStore = defineStore('flashcard', () => {
  const isFlipped = ref(false)
  const isHintShown = ref(false)

  function toggleIsHintShown() {
    isHintShown.value = !isHintShown.value
  }

  function toggleIsFlipped() {
    isFlipped.value = !isFlipped.value
  }

  function $reset() {
    isFlipped.value = false
    isHintShown.value = false
  }

  return { isFlipped, isHintShown, toggleIsFlipped, toggleIsHintShown, $reset }
})

export default useFlashcardStore
