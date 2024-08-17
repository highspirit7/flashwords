import { authContext } from '@tests/utils/context'
import {
  fakeCard,
  fakeCardset,
  fakeUser,
  fakeExample,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import exampleRouter from '..'

const createCaller = createCallerFactory(exampleRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', [fakeUser()])

const [cardset] = await insertAll(db, 'cardset', [
  fakeCardset({ userId: user.id }),
])

const [card] = await insertAll(db, 'card', fakeCard({ cardsetId: cardset.id }))

const [example, exampleOther] = await insertAll(db, 'example', [
  fakeExample({ cardId: card.id }),
  fakeExample({ cardId: card.id }),
])

const { remove } = createCaller(authContext({ db }, user))

it('should delete an example', async () => {
  const removeResult = await remove(example.id)

  expect(removeResult.success).toStrictEqual(true)
})

it('should throw an error if the example does not exist', async () => {
  const nonExistentId = example.id + exampleOther.id

  await expect(remove(nonExistentId)).rejects.toThrowError(/deletion failed/i)
})
