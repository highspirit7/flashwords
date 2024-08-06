import { createTestDatabase } from '@tests/utils/database'
import { fakeCardset, fakeUser, fakeCard } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { cardRepository } from '../cardRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = cardRepository(db)

const [user] = await insertAll(db, 'user', [fakeUser()])
const [cardset, anotherCardset] = await insertAll(db, 'cardset', [
  fakeCardset({ userId: user.id }),
  fakeCardset({ userId: user.id }),
])

describe('create', () => {
  it('should create a card in the cardset matching a given cardset id', async () => {
    const createdCard = await repository.create(
      fakeCard({ term: 'leuk', definition: 'nice', cardsetId: cardset.id })
    )

    expect(createdCard).toEqual({
      id: expect.any(Number),
      term: 'leuk',
      definition: 'nice',
      cardsetId: cardset.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('throw an error if referenced cardset does not exist', async () => {
    await expect(
      repository.create(fakeCard({ cardsetId: cardset.id + 11111 }))
    ).rejects.toThrow(/Referenced cardset matching cardsetId does not exist/)
  })
})

describe('findAllByCardsetId', () => {
  it('should return an empty array when there are no cards in the cardset', async () => {
    const cards = await repository.findAllByCardsetId({
      offset: 0,
      limit: 5,
      cardsetId: cardset.id,
    })

    expect(cards).toEqual([])
  })

  it('should return an empty array when there are no cards in the cardset matching the given cardset id', async () => {
    await insertAll(db, 'card', [fakeCard({ cardsetId: anotherCardset.id })])

    const cards = await repository.findAllByCardsetId({
      offset: 0,
      limit: 5,
      cardsetId: cardset.id,
    })

    expect(cards).toEqual([])
  })

  it('should return cards in descending order(id)', async () => {
    await insertAll(db, 'card', [
      fakeCard({
        cardsetId: cardset.id,
      }),
      fakeCard({
        cardsetId: cardset.id,
      }),
    ])

    const cards = await repository.findAllByCardsetId({
      offset: 0,
      limit: 10,
      cardsetId: cardset.id,
    })

    expect(cards[0].id).toBeGreaterThan(cards[1].id)
  })

  it('should return 3 cards with setting limit as 3', async () => {
    await insertAll(db, 'card', [
      fakeCard({
        cardsetId: cardset.id,
      }),
      fakeCard({
        cardsetId: cardset.id,
      }),
      fakeCard({
        cardsetId: cardset.id,
      }),
      fakeCard({
        cardsetId: cardset.id,
      }),
      fakeCard({
        cardsetId: cardset.id,
      }),
    ])

    const cardsets = await repository.findAllByCardsetId({
      offset: 0,
      limit: 3,
      cardsetId: cardset.id,
    })

    expect(cardsets).toHaveLength(3)
  })
})
