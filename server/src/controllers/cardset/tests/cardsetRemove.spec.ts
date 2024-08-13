import { authContext } from '@tests/utils/context'
import { fakeCardset, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import cardsetRouter from '..'

const createCaller = createCallerFactory(cardsetRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user, userOther] = await insertAll(db, 'user', [fakeUser(), fakeUser()])

const [cardset, cardsetOther] = await insertAll(db, 'cardset', [
  fakeCardset({ userId: user.id }),
  fakeCardset({ userId: userOther.id }),
])

const { remove } = createCaller(authContext({ db }, user))

it('should delete a cardset', async () => {
  // When (ACT)
  const { numDeletedRows } = await remove(cardset.id)

  // Then (ASSERT)
  expect(numDeletedRows).toEqual('1')
})

it('should throw an error if the cardset does not exist', async () => {
  const nonExistantId = cardset.id + cardsetOther.id

  await expect(remove(nonExistantId)).rejects.toThrowError(/not found/i)
})

it('should throw an error if the user tries to remove the cardset of other users', async () => {
  await expect(remove(cardsetOther.id)).rejects.toThrowError(
    /does not have permission to access/i
  )
})
