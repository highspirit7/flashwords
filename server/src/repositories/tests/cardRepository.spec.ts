import { createTestDatabase } from '@tests/utils/database'
import { fakeCardset, fakeUser, fakeCard } from '@server/entities/tests/fakes'
import serializeBigInt from '@server/utils/serializeBigInt'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { clearTables, insertAll } from '@tests/utils/records'
import { cardRepository } from '../cardRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = cardRepository(db)

const [user] = await insertAll(db, 'user', [fakeUser()])
const [cardset, anotherCardset] = await insertAll(db, 'cardset', [
  fakeCardset({ userId: user.id }),
  fakeCardset({ userId: user.id }),
])

beforeEach(async () => {
  await clearTables(db, ['card'])
})

describe('create', () => {
  it('should create cards in the cardset matching a given cardset id', async () => {
    const createdCards = await repository.createAll([
      fakeCard({ term: 'leuk', definition: 'nice', cardsetId: cardset.id }),
      fakeCard({ term: 'lekker', definition: 'tasty', cardsetId: cardset.id }),
    ])

    expect(createdCards).toHaveLength(2)
    expect(createdCards[0]).toEqual({
      id: expect.any(Number),
      term: 'leuk',
      definition: 'nice',
      cardsetId: cardset.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
    expect(createdCards[1]).toEqual({
      id: expect.any(Number),
      term: 'lekker',
      definition: 'tasty',
      cardsetId: cardset.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('throw an error if referenced cardset does not exist', async () => {
    await expect(
      repository.createAll([fakeCard({ cardsetId: cardset.id + 11111 })])
    ).rejects.toThrow(/Referenced cardset matching cardsetId does not exist/)
  })
})

describe('findAllByCardsetId', () => {
  it('should return an empty array when there are no cards in the cardset', async () => {
    const nonExistentCardsetId = cardset.id + anotherCardset.id
    const cards = await repository.findAllByCardsetId({
      offset: 0,
      limit: 5,
      cardsetId: nonExistentCardsetId,
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

    const cards = await repository.findAllByCardsetId({
      offset: 0,
      limit: 3,
      cardsetId: cardset.id,
    })

    expect(cards).toHaveLength(3)
  })
})

describe('update', async () => {
  it('should update the card with the given cardId', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({
        cardsetId: cardset.id,
      }),
    ])

    const updateResult = await repository.update(
      { term: 'huis', definition: 'house' },
      card.id
    )

    const numUpdatedRows: string = serializeBigInt(updateResult).numUpdatedRows

    expect(numUpdatedRows).toEqual('1')
  })

  it('should return 0 numUpdatedRows if there is no matching card with the given cardId', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({
        cardsetId: cardset.id,
      }),
    ])

    const updateResult = await repository.update(
      { term: 'huis', definition: 'house' },
      card.id + 11111
    )

    const numUpdatedRows: string = serializeBigInt(updateResult).numUpdatedRows

    expect(numUpdatedRows).toEqual('0')
  })
})

describe('delete', () => {
  it('the number of deleted rows would be 0 if there is no matching card with the given id', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({ cardsetId: cardset.id }),
    ])

    const { numDeletedRows } = await repository.delete(card.id + 11111)

    expect(numDeletedRows).toEqual(BigInt(0))
  })

  it('should delete a cardset with the given id', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({ cardsetId: cardset.id }),
    ])

    const { numDeletedRows } = await repository.delete(card.id)

    expect(numDeletedRows).toEqual(BigInt(1))
  })
})
