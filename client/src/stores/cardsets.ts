import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { authTrpc } from '@/trpc'
import { useToasterStore } from '@/stores/toaster'
import type { CardPublic, CardsetPublicWithCardCount } from '@server/shared/types'

const defaultCardSet: CardsetPublicWithCardCount = {
  id: 0,
  title: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 0,
  cardCount: '0',
}

type CreatableCardset = Pick<CardsetPublicWithCardCount, 'title' | 'description'>
type CreatableCard = Pick<CardPublic, 'term' | 'definition'>

export const useCardsetStore = defineStore('cardsets', () => {
  const toasterStore = useToasterStore()
  const router = useRouter()

  const cardsets: Ref<CardsetPublicWithCardCount[]> = ref([])
  const selectedCardset: Ref<CardsetPublicWithCardCount> = ref(defaultCardSet)
  const filteredCardsets: Ref<CardsetPublicWithCardCount[]> = ref([])

  async function setCardsets() {
    const initialCardsets = await authTrpc.cardset.findAll.query({})
    cardsets.value = initialCardsets
    filteredCardsets.value = initialCardsets
  }

  function resetFilteredCardsets() {
    filteredCardsets.value = [...cardsets.value]
  }

  function setFilteredCardsets(cardsets: CardsetPublicWithCardCount[]) {
    filteredCardsets.value = [...cardsets]
  }

  async function createCardset(input: { cardset: CreatableCardset; cards: CreatableCard[] }) {
    await authTrpc.cardset.create.mutate(input)

    toasterStore.success({ text: 'You just created a new card set!' })
    router.push('/')
  }

  async function setSelectedCardset(cardsetId: number) {
    const foundCardset = await authTrpc.cardset.find.query(cardsetId)
    selectedCardset.value = foundCardset
  }

  // TODO : better to add return type of function as well
  // TODO : even void bettter to add anyway

  async function deleteCardset(id: number) {
    await authTrpc.cardset.remove.mutate(id)
  }

  return {
    cardsets,
    filteredCardsets,
    selectedCardset,
    createCardset,
    setCardsets,
    setSelectedCardset,
    resetFilteredCardsets,
    setFilteredCardsets,
    deleteCardset,
  }
})
