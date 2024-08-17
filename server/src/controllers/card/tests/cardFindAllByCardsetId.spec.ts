import { fakeCardset, fakeUser, fakeCard } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import cardRouter from '..'

const createCaller = createCallerFactory(cardRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())
const [cardset] = await insertAll(
  db,
  'cardset',
  fakeCardset({ userId: user.id })
)

const { findAllByCardsetId } = createCaller(authContext({ db }, user))

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { findAllByCardsetId } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(findAllByCardsetId({ cardsetId: cardset.id })).rejects.toThrow(
    /unauthenticated/i
  )
})

it('should return an empty list if there are no cards', async () => {
  // Given (ARRANGE)
  expect(await findAllByCardsetId({ cardsetId: cardset.id })).toHaveLength(0)
})

it('should return a list of cards', async () => {
  // Given (ARRANGE)
  await insertAll(db, 'card', [fakeCard({ cardsetId: cardset.id })])

  // When (ACT)
  const cards = await findAllByCardsetId({ cardsetId: cardset.id })

  // Then (ASSERT)
  expect(cards).toHaveLength(1)
})
