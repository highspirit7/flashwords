import {
  fakeCardset,
  fakeUser,
  fakeCard,
  fakeExample,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
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

const { findAllByCardId } = createCaller(authContext({ db }, user))

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { findAllByCardId } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(findAllByCardId({ cardId: card.id })).rejects.toThrow(
    /unauthenticated/i
  )
})

it('should return an empty list if there are no examples', async () => {
  // Given (ARRANGE)
  expect(await findAllByCardId({ cardId: card.id })).toHaveLength(0)
})

it('should return a list of examples', async () => {
  // Given (ARRANGE)
  await insertAll(db, 'example', [fakeExample({ cardId: card.id })])

  // When (ACT)
  const examples = await findAllByCardId({ cardId: card.id })

  // Then (ASSERT)
  expect(examples).toHaveLength(1)
})
