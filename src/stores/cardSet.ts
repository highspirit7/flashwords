import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import { CARD_SET_LOCALSTORAGE_KEY } from '@/utils/constants'
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
  const cardSets: Ref<CardSet[]> = ref(localStorage.getItem(CARD_SET_LOCALSTORAGE_KEY) ?? [])
  const selectedCardSet: Ref<CardSet> = ref({
    id: '',
    title: '',
    description: '',
    cards: [],
    createdAt: undefined,
    updatedAt: undefined,
  })

  function saveInLocalStorage() {
    localStorage.setItem(CARD_SET_LOCALSTORAGE_KEY, cardSets.value)
  }

  function createCardSet(data: CardSet) {
    cardSets.value.push(data)
    saveInLocalStorage()
  }

  function selectCardSet(id: string) {
    const [oneCardSet] = cardSets.value.filter(cardSet => cardSet.id === id)
    selectedCardSet.value = oneCardSet
  }

  //   function updateCard(newData: Card, cardSetId: string) {
  //     const selectedCardSet = cardSets.value.filter((cardSet: CardSet) => cardSet.id === cardSetId)[0]
  //     selectedCardSet.cards = selectedCardSet.cards.map((card: Card) => {
  //       if (card.id === newData.id) {
  //         return newData
  //       }
  //       return card
  //     })

  //     saveInLocalStorage()
  //   }

  return { cardSets, createCardSet, saveInLocalStorage, selectCardSet, selectedCardSet }
})
