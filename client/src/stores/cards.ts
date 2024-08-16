import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { authTrpc } from '@/trpc'
import type { CardPublic } from '@server/entities/card'
import { assertError } from '@/utils/errors'
import { useToasterStore } from '@/stores/toaster'

export const useCardStore = defineStore('cards', () => {
  const toasterStore = useToasterStore()
  const cardsInSelectedCardset: Ref<CardPublic[]> = ref([])

  async function setCardsInSelectedCardset(cardsetId: number) {
    const cards = await authTrpc.card.findAllByCardsetId.query({ cardsetId })

    cardsInSelectedCardset.value = cards
  }

  async function addEmptyCard(cardsetId: number) {
    const newCard = {
      term: '',
      definition: '',
      cardsetId,
    }
    const [createdCard] = await authTrpc.card.createAll.mutate([newCard])

    cardsInSelectedCardset.value.push(createdCard)
  }

  async function removeCard(cardId: number) {
    try {
      const { success } = await authTrpc.card.remove.mutate(cardId)

      if (success) {
        cardsInSelectedCardset.value = cardsInSelectedCardset.value.filter(
          card => card.id !== cardId,
        )
      }
    } catch (error) {
      assertError(error)
      toasterStore.danger({ text: error.message })
    }
  }
  return {
    cardsInSelectedCardset,
    setCardsInSelectedCardset,
    addEmptyCard,
    removeCard,
  }
})
