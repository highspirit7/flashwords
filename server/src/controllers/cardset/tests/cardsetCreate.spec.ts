import { authContext, requestContext } from '@tests/utils/context'
import { fakeCard, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import cardsetRouter from '..'

const createCaller = createCallerFactory(cardsetRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { create } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(
    create({
      cardset: {
        title: 'Dutch A1',
        description: '',
      },
      cards: [fakeCard()],
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a cardset with cards and it should persist', async () => {
  // ARRANGE
  const [user] = await insertAll(db, 'user', fakeUser())
  const { create } = createCaller(authContext({ db }, user))

  // ACT
  const createdCardset = await create({
    cardset: {
      title: 'Dutch A2',
      description: 'From Leiden University Class',
    },
    cards: [fakeCard(), fakeCard()],
  })

  // ASSERT
  expect(createdCardset).toMatchObject({
    id: expect.any(Number),
    title: 'Dutch A2',
    description: 'From Leiden University Class',
    userId: user.id,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  })

  const [selectedCardset] = await selectAll(db, 'cardset', (eb) =>
    eb('id', '=', createdCardset.id)
  )

  expect(selectedCardset).toMatchObject(createdCardset)

  const createdCards = await selectAll(db, 'card', (eb) =>
    eb('cardsetId', '=', createdCardset.id)
  )

  expect(createdCards).toHaveLength(2)
  expect(createdCards[0]).toMatchObject({
    id: expect.any(Number),
    term: expect.any(String),
    definition: expect.any(String),
    cardsetId: createdCardset.id,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  })
})
