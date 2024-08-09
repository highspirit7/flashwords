import { createTestDatabase } from '@tests/utils/database'
import { fakeCardset, fakeUser } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { cardsetRepository } from '../cardsetRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = cardsetRepository(db)

const [user, anotherUser] = await insertAll(db, 'user', [
  fakeUser(),
  fakeUser(),
])

describe('create', () => {
  it('should create a card set', async () => {
    const createdCardset = await repository.create(
      fakeCardset({ title: 'Dutch A1', userId: user.id })
    )

    expect(createdCardset).toEqual({
      id: expect.any(Number),
      title: 'Dutch A1',
      description: expect.any(String),
      userId: user.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('throw an error if referenced user does not exist', async () => {
    await expect(
      repository.create(fakeCardset({ userId: user.id + 11111 }))
    ).rejects.toThrow(/Referenced user matching userId does not exist/)
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
