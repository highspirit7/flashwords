import { isString } from '@/utils/typePredicates'
import * as localStorage from '@/utils/localStorage'
import { type CardSet } from '@/stores/cardSet'

const defaultCardSet: CardSet = {
  id: '',
  title: '',
  description: '',
  cards: [],
  createdAt: undefined,
  updatedAt: undefined,
}

function getCardSetByIdFromLS(id: string) {
  return localStorage.getItem(localStorage.CARD_SETS_KEY)
    ? localStorage
        .getItem(localStorage.CARD_SETS_KEY)
        .filter((cardSet: CardSet) => cardSet.id === id)[0]
    : defaultCardSet
}

function getCurrentCardSet(id: unknown) {
  return isString(id) ? getCardSetByIdFromLS(id) : defaultCardSet
}

export default getCurrentCardSet
