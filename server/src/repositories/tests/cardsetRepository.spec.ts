import { createTestDatabase } from '@tests/utils/database'
import { fakeCardset, fakeUser, fakeCard } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import serializeBigInt from '@server/utils/serializeBigInt'
import { cardsetRepository } from '../cardsetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = cardsetRepository(db)

const [user, anotherUser] = await insertAll(db, 'user', [
  fakeUser(),
  fakeUser(),
])

describe('create', () => {
  it('should create a card set', async () => {
    const response = await repository.create(
      fakeCardset({ title: 'Dutch A1', userId: user.id })
    )

    expect(response).toEqual({
      id: expect.any(Number),
    })
  })

  it('throw an error if referenced user does not exist', async () => {
    await expect(
      repository.create(fakeCardset({ userId: user.id + 11111 }))
    ).rejects.toThrow(/Referenced user matching userId does not exist/)
  })
})

describe('findById', () => {
  it('should return a matching cardset with the given id', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({ userId: user.id }),
    ])
    await insertAll(db, 'card', [
      fakeCard({ cardsetId: cardset.id }),
      fakeCard({ cardsetId: cardset.id }),
    ])

    const foundCardset = await repository.findById(cardset.id)

    expect(foundCardset).toMatchObject({
      id: cardset.id,
      userId: user.id,
      cardCount: '2',
    })
  })

  it('should return undefined when there is no matching cardset with the given id', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({ userId: user.id }),
    ])

    const foundCardset = await repository.findById(cardset.id + 11111)

    expect(foundCardset).toBeUndefined()
  })
})

describe('findAllByUserId', () => {
  it('shoule return an empty array when there are no cardsets', async () => {
    const cardsets = await repository.findAllByUserId({
      offset: 0,
      limit: 10,
      userId: user.id,
    })

    expect(cardsets).toEqual([])
  })

  it('should return an empty array when there are no cardsets matching the given userId', async () => {
    await insertAll(db, 'cardset', [fakeCardset({ userId: anotherUser.id })])

    const cardsets = await repository.findAllByUserId({
      offset: 0,
      limit: 10,
      userId: user.id,
    })

    expect(cardsets).toEqual([])
  })

  it('should return cardsets in descending order(id)', async () => {
    await insertAll(db, 'cardset', [
      fakeCardset({
        userId: user.id,
      }),
      fakeCardset({
        userId: user.id,
      }),
    ])

    const cardsets = await repository.findAllByUserId({
      offset: 0,
      limit: 10,
      userId: user.id,
    })

    expect(cardsets[0].id).toBeGreaterThan(cardsets[1].id)
  })

  it('should return 3 cardsets with setting limit as 3', async () => {
    await insertAll(db, 'cardset', [
      fakeCardset({
        userId: user.id,
      }),
      fakeCardset({
        userId: user.id,
      }),
      fakeCardset({
        userId: user.id,
      }),
      fakeCardset({
        userId: user.id,
      }),
      fakeCardset({
        userId: user.id,
      }),
    ])

    const cardsets = await repository.findAllByUserId({
      offset: 0,
      limit: 3,
      userId: user.id,
    })

    expect(cardsets).toHaveLength(3)
  })
})

describe('delete', () => {
  it('the number of deleted rows would be 0 if there is no matching cardset with the given id', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({ userId: user.id }),
    ])

    const { numDeletedRows } = await repository.delete(cardset.id + 11111)

    expect(numDeletedRows).toEqual(BigInt(0))
  })

  it('should delete a cardset with the given id', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({ userId: user.id }),
    ])

    const { numDeletedRows } = await repository.delete(cardset.id)

    expect(numDeletedRows).toEqual(BigInt(1))
  })
})

describe('update', async () => {
  it('should update the card with the given cardId', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({
        userId: user.id,
      }),
    ])

    const updateResult = await repository.update(
      { title: 'Dutch B1' },
      cardset.id
    )

    const {numUpdatedRows} = serializeBigInt(updateResult)

    expect(numUpdatedRows).toEqual('1')
  })

  it('should return 0 numUpdatedRows if there is no matching card with the given cardId', async () => {
    const [cardset] = await insertAll(db, 'cardset', [
      fakeCardset({
        userId: user.id,
      }),
    ])

    const updateResult = await repository.update(
      { title: 'Dutch B1' },
      cardset.id + 11111
    )

    const {numUpdatedRows} = serializeBigInt(updateResult)

    expect(numUpdatedRows).toEqual('0')
  })
})
