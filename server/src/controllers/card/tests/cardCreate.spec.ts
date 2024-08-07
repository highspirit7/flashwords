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
  const { create } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(
    create({
      term: 'lekker',
      definition: 'tasty',
      cardsetId: cardset.id,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a card and it should persist', async () => {
  // ARRANGE

  const { create } = createCaller(authContext({ db }, user))

  // ACT
  const createdCard = await create({
    term: 'lekker',
    definition: 'tasty',
    cardsetId: cardset.id,
  })

  // ASSERT
  expect(createdCard).toMatchObject({
    id: expect.any(Number),
    term: 'lekker',
    definition: 'tasty',
    cardsetId: cardset.id,
  })

  const [selectedCard] = await selectAll(db, 'card', (eb) =>
    eb('id', '=', createdCard.id)
  )

  expect(selectedCard).toMatchObject(createdCard)
})
