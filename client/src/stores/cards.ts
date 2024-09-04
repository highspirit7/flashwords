import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { authTrpc } from '@/trpc'
import type { CardPublic } from '@server/shared/types'
import { assertError } from '@/utils/errors'
import { useToasterStore } from '@/stores/toaster'

export const useCardStore = defineStore('cards', () => {
  const toasterStore = useToasterStore()
  const cardsInSelectedCardset: Ref<CardPublic[]> = ref([])
  const selectedCard: Ref<CardPublic> = ref({
    id: 0,
    term: '',
    definition: '',
    cardsetId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  async function setCardsInSelectedCardset(cardsetId: number) {
    try {
      const cards = await authTrpc.card.findAllByCardsetId.query({ cardsetId })
      cardsInSelectedCardset.value = cards
    } catch (error) {
      toasterStore.danger({
        text: 'Failed to load cards. Try again later.',
      })
      throw error
    }
  }

  async function setSelectedCard(cardId: number) {
    const card = await authTrpc.card.find.query(cardId)

    selectedCard.value = { ...card }

    //   toasterStore.danger({
    //     text: 'Failed to fetch the card data. Try again later.',
    //   })
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
    selectedCard,
    setCardsInSelectedCardset,
    setSelectedCard,
    addEmptyCard,
    removeCard,
  }
})
