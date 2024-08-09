import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { authTrpc } from '@/trpc'
import type { CardPublic, CardsetPublic } from '@server/shared/types'

// export interface Card {
//   id: string
//   term: string
//   definition: string
//   examples: { id: number; sentence: string }[]
// }

// export interface CardSet {
//   id: string
//   title: string
//   description: string
//   cards: Card[]
//   createdAt: Date | undefined
//   updatedAt: Date | undefined
// }
const defaultCardSet: CardsetPublic = {
  id: 0,
  title: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
}

type CreatableCardset = Pick<CardsetPublic, 'title' | 'description'>
type CreatableCard = Pick<CardPublic, 'term' | 'definition'>

export const useCardsetStore = defineStore('cardsets', () => {
  const cardsets: Ref<CardsetPublic[]> = ref([])
  const currentCardset: Ref<CardsetPublic> = ref(defaultCardSet)
  const filteredCardsets: Ref<CardsetPublic[]> = ref([])

  async function setInitialCardsets() {
    const initialCardsets = await authTrpc.cardset.findAll.query({})
    cardsets.value = initialCardsets
    filteredCardsets.value = initialCardsets
  }

  function resetFilteredCardsets() {
    filteredCardsets.value = [...cardsets.value]
  }

  function setFilteredCardsets(cardsets: CardsetPublic[]) {
    filteredCardsets.value = [...cardsets]
  }

  //   async function setInitialCardsets() {
  //     const authUserCardsets = await authTrpc.cardset.findAll.query({})
  //     cardsets.value = authUserCardsets
  //   }
  //   const selectedCard: Ref<Card> = ref(
  //     localStorage.getItem(localStorage.SELECTED_CARD_KEY) ?? {
  //       id: '',
  //       term: '',
  //       definition: '',
  //       examples: [],
  //     },
  //   )

  //   function generateNewExampleId(examples: { id: number; sentence: string }[]) {
  //     return examples.length < 1 ? 0 : examples[examples.length - 1].id + 1
  //   }

  async function createCardset(input: { cardset: CreatableCardset; cards: CreatableCard[] }) {
    const createdCardset = await authTrpc.cardset.create.mutate(input)
    cardsets.value.push(createdCardset)
  }

  function setCurrentCardset(id: number) {
    currentCardset.value = cardsets.value.filter(cardset => cardset.id === id)[0]
  }

  //   function setSelectedCard(data: Card) {
  //     selectedCard.value = data
  //     saveSelectedCardInStorage()
  //   }

  //   function updateCardInCardSet(cardSetId: string) {
  //     const cardSet = getCardSetById(cardSetId)
  //     cardSet.cards = cardSet.cards.map((card: Card) => {
  //       return card.id === selectedCard.value.id ? selectedCard.value : card
  //     })
  //     cardSet.updatedAt = new Date()
  //     saveCardSetsInStorage()
  //   }

  //   function updateCardSet(data: CardSet) {
  //     cardSets.value = cardSets.value.map((cardSet: CardSet) =>
  //       data.id === cardSet.id ? data : cardSet,
  //     )
  //     saveCardSetsInStorage()
  //   }

  //   function addExampleOfCard(sentence: string, cardSetId: string) {
  //     selectedCard.value.examples.push({
  //       id: generateNewExampleId(selectedCard.value.examples),
  //       sentence,
  //     })
  //     saveSelectedCardInStorage()
  //     updateCardInCardSet(cardSetId)
  //   }

  //   function deleteExampleInCard(exampleId: number, cardSetId: string) {
  //     selectedCard.value.examples = selectedCard.value.examples.filter(
  //       (example: { id: number; sentence: string }) => example.id !== exampleId,
  //     )
  //     saveSelectedCardInStorage()
  //     updateCardInCardSet(cardSetId)
  //   }

  // TODO : better to add return type of function as well
  // TODO : even void bettter to add anyway
  //   function updateDateInCardSet(cardSetId: string) {
  //     const cardSet = getCardSetById(cardSetId)
  //     cardSet.updatedAt = new Date()

  //     saveCardSetsInStorage()
  //   }

  //   function deleteCardSet(id: string) {
  //     cardSets.value = cardSets.value.filter((cardSet: CardSet) => id !== cardSet.id)
  //     saveCardSetsInStorage()
  //   }

  return {
    // selectors
    cardsets,
    filteredCardsets,
    currentCardset,
    // selectedCard,
    // getters
    // getCardSetById,
    // actions
    createCardset,
    setInitialCardsets,
    setCurrentCardset,
    resetFilteredCardsets,
    setFilteredCardsets,
  }
})
