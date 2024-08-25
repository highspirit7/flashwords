import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { ExamplePublic } from '@server/shared/types'
import { authTrpc } from '@/trpc'
import { useToasterStore } from './toaster'
import { assertError } from '@/utils/errors'

const toasterStore = useToasterStore()

export const useExampleStore = defineStore('examples', () => {
  const examplesInSelectedCard: Ref<ExamplePublic[]> = ref([])

  async function setExamplesInSelectedCard(cardId: number) {
    try {
      const examples = await authTrpc.example.findAllByCardId.query({ cardId })

      examplesInSelectedCard.value = examples
    } catch (error) {
      assertError(error)
      console.log(error)
      toasterStore.danger({ text: 'Failed to load examples. Try again later.' })
    }
  }

  async function addExample(content: string, cardId: number) {
    try {
      const createdExample = await authTrpc.example.create.mutate({ cardId, content })

      examplesInSelectedCard.value.push(createdExample)
    } catch (error) {
      assertError(error)
      console.log(error)
      toasterStore.danger({ text: 'Failed to create an example. Try again later.' })
    }
  }

  async function updateExample(content: string, exampleId: number) {
    try {
      await authTrpc.example.update.mutate({ record: { content }, exampleId })
    } catch (error) {
      assertError(error)
      toasterStore.danger({ text: error.message })
    }
  }

  async function deleteExample(exampleId: number) {
    try {
      await authTrpc.example.remove.mutate(exampleId)

      examplesInSelectedCard.value = examplesInSelectedCard.value.filter(
        example => example.id !== exampleId,
      )
    } catch (error) {
      throw error
    }
  }

  return {
    examplesInSelectedCard,
    setExamplesInSelectedCard,
    addExample,
    updateExample,
    deleteExample,
  }
})
