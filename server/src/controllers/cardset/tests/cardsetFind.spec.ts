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

const [cardset, cardsetOther, cardsetOfOtherUser] = await insertAll(
  db,
  'cardset',
  [
    fakeCardset({ userId: user.id }),
    fakeCardset({ userId: user.id }),
    fakeCardset({ userId: userOther.id }),
  ]
)

const { find } = createCaller(authContext({ db }, user))

it('should return a cardset', async () => {
  // When (ACT)
  const foundCardset = await find(cardset.id)

  // Then (ASSERT)
  expect(foundCardset).toMatchObject(cardset)
})

it('should throw an error if the cardset does not exist', async () => {
  const nonExistantId = cardset.id + cardsetOther.id

  // When (ACT)
  await expect(find(nonExistantId)).rejects.toThrowError(/not found/i)
})

it("should throw an error if authUser tries to access another user's cardset", async () => {
  await expect(find(cardsetOfOtherUser.id)).rejects.toThrowError(
    /does not have permission to access/i
  )
})
