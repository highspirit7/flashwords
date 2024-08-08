import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
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
      title: 'Dutch A1',
      description: null,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a cardset and it should persist', async () => {
  // ARRANGE
  const [user] = await insertAll(db, 'user', fakeUser())
  const { create } = createCaller(authContext({ db }, user))

  // ACT
  const createdCardset = await create({
    title: 'Dutch A2',
    description: 'From Leiden University Class',
  })

  // ASSERT
  expect(createdCardset).toMatchObject({
    id: expect.any(Number),
    title: 'Dutch A2',
    description: 'From Leiden University Class',
    userId: user.id,
  })

  const [selectedCardset] = await selectAll(db, 'cardset', (eb) =>
    eb('id', '=', createdCardset.id)
  )

  expect(selectedCardset).toMatchObject(createdCardset)
})
