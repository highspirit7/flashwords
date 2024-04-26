import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import * as localStorage from '@/utils/localStorage'

export interface Card {
  id: string
  term: string
  definition: string
  examples: { id: number; sentence: string }[]
}

export interface CardSet {
  id: string
  title: string
  description: string
  cards: Card[]
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export const useCardSetStore = defineStore('cardSets', () => {
  const cardSets: Ref<CardSet[]> = ref(localStorage.getItem(localStorage.CARD_SETS_KEY) ?? [])
  const selectedCardSet: Ref<CardSet> = ref({
    id: '',
    title: '',
    description: '',
    cards: [],
    createdAt: undefined,
    updatedAt: undefined,
  })
  const selectedCard: Ref<Card> = ref(
    localStorage.getItem(localStorage.SELECTED_CARD_KEY) ?? {
      id: '',
      term: '',
      definition: '',
      examples: [],
    },
  )

  function getCardSetById(id: string) {
    return cardSets.value.filter(cardSet => cardSet.id === id)[0]
  }

  function saveCardSetsinLS() {
    localStorage.setItem(localStorage.CARD_SETS_KEY, cardSets.value)
  }

  function saveSelectedCardInLS() {
    localStorage.setItem(localStorage.SELECTED_CARD_KEY, cardSets.value)
  }

  function createCardSet(data: CardSet) {
    cardSets.value.push(data)
    saveCardSetsinLS()
  }

  function selectCard(data: Card) {
    selectedCard.value = data
  }

  return {
    cardSets,
    createCardSet,
    saveCardSetsinLS,
    selectedCard,
    selectCard,
    getCardSetById,
  }
})
