import { fakeCardset, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import cardsetRouter from '..'

const createCaller = createCallerFactory(cardsetRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())
const [cardset] = await insertAll(
  db,
  'cardset',
  fakeCardset({ userId: user.id })
)

const { update } = createCaller(authContext({ db }, user))

it('should throw an error if the cardset matching the given cardsetId does not exist ', async () => {
  await expect(
    update({ record: { title: 'Korean A1' }, cardsetId: cardset.id + 11111 })
  ).rejects.toThrow(/Update failed/)
})

it('should update a cardset successfully', async () => {
  const updatedResult = await update({
    record: { title: 'Korean A1' },
    cardsetId: cardset.id,
  })

  expect(updatedResult.success).toStrictEqual(true)
})
