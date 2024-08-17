import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser, fakeCardset, fakeCard } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import exampleRouter from '..'

const createCaller = createCallerFactory(exampleRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())
const [cardset] = await insertAll(
  db,
  'cardset',
  fakeCardset({ userId: user.id })
)
const [card] = await insertAll(db, 'card', fakeCard({ cardsetId: cardset.id }))

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { create } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(
    create({
      content: 'Dit huis is lelijk',
      cardId: card.id,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create an example and it should persist', async () => {
  const { create } = createCaller(authContext({ db }, user))

  const createdExample = await create({
    content: 'Dit huis is lelijk',
    cardId: card.id,
  })

  expect(createdExample).toEqual({
    id: expect.any(Number),
    content: 'Dit huis is lelijk',
    cardId: card.id,
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date),
  })

  const [selectedExample] = await selectAll(db, 'example', (eb) =>
    eb('id', '=', createdExample.id)
  )

  expect(selectedExample).toMatchObject(createdExample)
})
