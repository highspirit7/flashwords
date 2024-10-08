import { fakeCardset, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import cardsetRouter from '..'

const createCaller = createCallerFactory(cardsetRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())

const { findAll } = createCaller(authContext({ db }, user))

it('should throw an error if user is not authenticated', async () => {
  // ARRANGE
  const { findAll: findAllWithoutAuth } = createCaller(requestContext({ db }))

  // ACT & ASSERT
  await expect(findAllWithoutAuth({ userId: user.id })).rejects.toThrow(
    /unauthenticated/i
  )
})

it('should return an empty list if there are no cardsets', async () => {
  // Given (ARRANGE)
  expect(await findAll({ userId: user.id })).toHaveLength(0)
})

it('should return a list of cardsets', async () => {
  // Given (ARRANGE)
  await insertAll(db, 'cardset', [fakeCardset({ userId: user.id })])

  // When (ACT)
  const cardsets = await findAll({ userId: user.id })

  // Then (ASSERT)
  expect(cardsets).toHaveLength(1)
})

it('should return the latest cardset first', async () => {
  // Given (ARRANGE)
  const [cardsetOld] = await insertAll(db, 'cardset', [
    fakeCardset({ userId: user.id }),
  ])
  const [cardsetNew] = await insertAll(db, 'cardset', [
    fakeCardset({ userId: user.id }),
  ])

  // When (ACT)
  const cardsets = await findAll({ userId: user.id })

  // Then (ASSERT)
  expect(cardsets[0]).toMatchObject(cardsetNew)
  expect(cardsets[1]).toMatchObject(cardsetOld)
})
