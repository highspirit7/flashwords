import Chance from 'chance'
import { createTestDatabase } from '@tests/utils/database'
import { fakeCard } from '@server/entities/tests/fakes'
import serializeBigInt from '@server/utils/serializeBigInt'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { random } from '@tests/utils/random'
import { POSTGRES_INT_MAX } from '@server/consts'
import type { UserPublic } from '@server/shared/types'

import { cardRepository } from '../cardRepository'
import { userRepository } from '../userRepository'
import { cardsetRepository } from '../cardsetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = {
  card: cardRepository(db),
  user: userRepository(db),
  cardset: cardsetRepository(db),
}
const chance = new Chance()
let testuser: UserPublic
let cardset: { id: number }

beforeAll(async () => {
  testuser = await repository.user.create({
    username: chance.name().replaceAll(' ', ''),
    email: `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`,
    password: 'Testuser123',
  })

  cardset = await repository.cardset.create({
    title: 'test set',
    description: '',
    userId: testuser?.id,
  })
})

describe('create', () => {
  it('should create cards in the cardset matching a given cardset id', async () => {
    const randomTerm0 = random.word({ length: 11 })
    const randomTerm1 = random.word({ length: 12 })
    const randomDefinition0 = random.word()
    const randomDefinition1 = random.word()

    const createdCards = await repository.card.createAll([
      fakeCard({
        term: randomTerm0,
        definition: randomDefinition0,
        cardsetId: cardset.id,
      }),
      fakeCard({
        term: randomTerm1,
        definition: randomDefinition1,
        cardsetId: cardset.id,
      }),
    ])

    expect(createdCards).toHaveLength(2)
    expect(createdCards[0]).toEqual({
      id: expect.any(Number),
      term: randomTerm0,
      definition: randomDefinition0,
      cardsetId: cardset.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
    expect(createdCards[1]).toEqual({
      id: expect.any(Number),
      term: randomTerm1,
      definition: randomDefinition1,
      cardsetId: cardset.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('throw an error if referenced cardset does not exist', async () => {
    await expect(
      repository.card.createAll([fakeCard({ cardsetId: cardset.id + 11111 })])
    ).rejects.toThrow(/Referenced cardset matching cardsetId does not exist/)
  })
})

describe('findAllByCardsetId', () => {
  it('should return an empty array when there are no cards in the cardset matching the given cardset id', async () => {
    const noExistentCards = await repository.card.findAllByCardsetId({
      offset: 0,
      limit: 5,
      cardsetId: POSTGRES_INT_MAX,
    })

    expect(noExistentCards).toEqual([])
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

    const threeCards = await repository.card.findAllByCardsetId({
      offset: 0,
      limit: 3,
      cardsetId: cardset.id,
    })

    expect(threeCards).toHaveLength(3)
  })
})

describe('update', async () => {
  it('should update the card with the given cardId', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({
        cardsetId: cardset.id,
      }),
    ])

    const updateResult = await repository.card.update(
      { term: 'huis', definition: 'house' },
      card.id
    )

    const { numUpdatedRows } = serializeBigInt(updateResult)

    expect(numUpdatedRows).toEqual('1')
  })

  it('should return 0 numUpdatedRows if there is no matching card with the given cardId', async () => {
    const updateResult = await repository.card.update(
      { term: 'huis', definition: 'house' },
      POSTGRES_INT_MAX
    )

    const { numUpdatedRows } = serializeBigInt(updateResult)

    expect(numUpdatedRows).toEqual('0')
  })
})

describe('delete', () => {
  it('the number of deleted rows would be 0 if there is no matching card with the given id', async () => {
    const { numDeletedRows } = await repository.card.delete(POSTGRES_INT_MAX)

    expect(numDeletedRows).toEqual(BigInt(0))
  })

  it('should delete a cardset with the given id', async () => {
    const [card] = await insertAll(db, 'card', [
      fakeCard({ cardsetId: cardset.id }),
    ])

    const { numDeletedRows } = await repository.card.delete(card.id)

    expect(numDeletedRows).toEqual(BigInt(1))
  })
})
