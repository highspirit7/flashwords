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

  const selectedCard: Ref<Card> = ref(
    localStorage.getItem(localStorage.SELECTED_CARD_KEY) ?? {
      id: '',
      term: '',
      definition: '',
      examples: [],
    },
  )

  function generateNewExampleId(examples: { id: number; sentence: string }[]) {
    return examples.length < 1 ? 0 : examples[examples.length - 1].id + 1
  }

  function getCardSetById(id: string) {
    return cardSets.value.filter(cardSet => cardSet.id === id)[0]
  }

  function saveCardSetsinLS() {
    localStorage.setItem(localStorage.CARD_SETS_KEY, cardSets.value)
  }

  function saveSelectedCardInLS() {
    localStorage.setItem(localStorage.SELECTED_CARD_KEY, selectedCard.value)
  }

  function createCardSet(data: CardSet) {
    cardSets.value.push(data)
    saveCardSetsinLS()
  }

  function selectCard(data: Card) {
    selectedCard.value = data
    saveSelectedCardInLS()
  }

  function updateCardInCardSet(cardSetId: string) {
    const cardSet = getCardSetById(cardSetId)
    cardSet.cards = cardSet.cards.map((card: Card) => {
      return card.id === selectedCard.value.id ? selectedCard.value : card
    })
    cardSet.updatedAt = new Date()
    saveCardSetsinLS()
  }

  function updateCardSet(data: CardSet) {
    cardSets.value = cardSets.value.map((cardSet: CardSet) =>
      data.id === cardSet.id ? data : cardSet,
    )
    saveCardSetsinLS()
  }

  function addExampleOfCard(sentence: string, cardSetId: string) {
    selectedCard.value.examples.push({
      id: generateNewExampleId(selectedCard.value.examples),
      sentence,
    })
    saveSelectedCardInLS()
    updateCardInCardSet(cardSetId)
  }

  function deleteExampleInCard(exampleId: number, cardSetId: string) {
    selectedCard.value.examples = selectedCard.value.examples.filter(
      (example: { id: number; sentence: string }) => example.id !== exampleId,
    )
    saveSelectedCardInLS()
    updateCardInCardSet(cardSetId)
  }

  function updateDateInCardSet(cardSetId: string) {
    const cardSet = getCardSetById(cardSetId)
    cardSet.updatedAt = new Date()

    saveCardSetsinLS()
  }

  return {
    cardSets,
    createCardSet,
    saveCardSetsinLS,
    selectedCard,
    selectCard,
    getCardSetById,
    addExampleOfCard,
    saveSelectedCardInLS,
    updateCardInCardSet,
    deleteExampleInCard,
    updateDateInCardSet,
    updateCardSet,
  }
})
