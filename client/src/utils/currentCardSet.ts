import { isString } from '@/utils/typePredicates'
import * as localStorage from '@/utils/storage'
import type { CardSet, Card } from '@/stores/cardSet'

const defaultCardSet: CardSet = {
  id: '',
  title: '',
  description: '',
  cards: [],
  createdAt: undefined,
  updatedAt: undefined,
}

function getCardSetByIdFromStorage(id: string): CardSet {
  return localStorage.getItem(localStorage.CARD_SETS_KEY)
    ? localStorage
        .getItem(localStorage.CARD_SETS_KEY)
        .filter((cardSet: CardSet) => cardSet.id === id)[0]
    : defaultCardSet
}

function getCurrentCardSet(id: unknown): CardSet {
  return isString(id) ? getCardSetByIdFromStorage(id) : defaultCardSet
}

function getCardsOfCurrentCardSet(id: unknown): Card[] {
  const currentCardSet = getCurrentCardSet(id)

  return currentCardSet.cards
}

export { getCurrentCardSet, getCardsOfCurrentCardSet }
