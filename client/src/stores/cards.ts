import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { authTrpc } from '@/trpc'
import type { CardPublic } from '@server/entities/card'

export const useCardStore = defineStore('cards', () => {
  const cardsInSelectedCardset: Ref<CardPublic[]> = ref([])

  async function setCardsInSelectedCardset(cardsetId: number) {
    const cards = await authTrpc.card.findAllByCardsetId.query({ cardsetId })

    cardsInSelectedCardset.value = cards
  }

  return {
    cardsInSelectedCardset,
    setCardsInSelectedCardset,
  }
})
