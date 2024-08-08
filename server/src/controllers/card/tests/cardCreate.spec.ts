import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser, fakeCardset } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import cardRouter from '..'

const createCaller = createCallerFactory(cardRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())
const [cardset] = await insertAll(
  db,
  'cardset',
  fakeCardset({ userId: user.id })
)

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { createAll } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(
    createAll([
      {
        term: 'lekker',
        definition: 'tasty',
        cardsetId: cardset.id,
      },
    ])
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a card and it should persist', async () => {
  // ARRANGE

  const { createAll } = createCaller(authContext({ db }, user))

  // ACT
  const createdCard = await createAll([
    {
      term: 'lekker',
      definition: 'tasty',
      cardsetId: cardset.id,
    },
  ])

  // ASSERT
  expect(createdCard).toEqual([
    {
      id: expect.any(Number),
      term: 'lekker',
      definition: 'tasty',
      cardsetId: cardset.id,
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
    },
  ])

  const [selectedCard] = await selectAll(db, 'card', (eb) =>
    eb('id', '=', createdCard[0].id)
  )

  expect(selectedCard).toMatchObject(createdCard[0])
})
