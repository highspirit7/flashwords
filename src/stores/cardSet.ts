import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import * as localStorage from '@/utils/storage'

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

  function saveCardSetsInStorage() {
    localStorage.setItem(localStorage.CARD_SETS_KEY, cardSets.value)
  }

  function saveSelectedCardInStorage() {
    localStorage.setItem(localStorage.SELECTED_CARD_KEY, selectedCard.value)
  }

  function createCardSet(data: CardSet) {
    cardSets.value.push(data)
    saveCardSetsInStorage()
  }

  function setSelectedCard(data: Card) {
    selectedCard.value = data
    saveSelectedCardInStorage()
  }

  function updateCardInCardSet(cardSetId: string) {
    const cardSet = getCardSetById(cardSetId)
    cardSet.cards = cardSet.cards.map((card: Card) => {
      return card.id === selectedCard.value.id ? selectedCard.value : card
    })
    cardSet.updatedAt = new Date()
    saveCardSetsInStorage()
  }

  function updateCardSet(data: CardSet) {
    cardSets.value = cardSets.value.map((cardSet: CardSet) =>
      data.id === cardSet.id ? data : cardSet,
    )
    saveCardSetsInStorage()
  }

  function addExampleOfCard(sentence: string, cardSetId: string) {
    selectedCard.value.examples.push({
      id: generateNewExampleId(selectedCard.value.examples),
      sentence,
    })
    saveSelectedCardInStorage()
    updateCardInCardSet(cardSetId)
  }

  function deleteExampleInCard(exampleId: number, cardSetId: string) {
    selectedCard.value.examples = selectedCard.value.examples.filter(
      (example: { id: number; sentence: string }) => example.id !== exampleId,
    )
    saveSelectedCardInStorage()
    updateCardInCardSet(cardSetId)
  }

  // TODO : better to add return type of function as well
  // TODO : even void bettter to add anyway
  function updateDateInCardSet(cardSetId: string) {
    const cardSet = getCardSetById(cardSetId)
    cardSet.updatedAt = new Date()

    saveCardSetsInStorage()
  }

  function deleteCardSet(id: string) {
    cardSets.value = cardSets.value.filter((cardSet: CardSet) => id !== cardSet.id)
    saveCardSetsInStorage()
  }

  return {
    // selectors
    cardSets,
    selectedCard,
    // getters
    getCardSetById,
    // actions
    setSelectedCard,
    createCardSet,
    addExampleOfCard,
    updateCardInCardSet,
    deleteExampleInCard,
    updateDateInCardSet,
    updateCardSet,
    deleteCardSet,
    // storage
    saveSelectedCardInStorage,
    saveCardSetsInStorage,
  }
})
