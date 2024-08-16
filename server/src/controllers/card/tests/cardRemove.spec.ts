import { authContext } from '@tests/utils/context'
import { fakeCard, fakeCardset, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import cardRouter from '..'

const createCaller = createCallerFactory(cardRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', [fakeUser()])

const [cardset] = await insertAll(db, 'cardset', [
  fakeCardset({ userId: user.id }),
])

const [card, cardOther] = await insertAll(db, 'card', [
  fakeCard({ cardsetId: cardset.id }),
  fakeCard({ cardsetId: cardset.id }),
])

const { remove } = createCaller(authContext({ db }, user))

it('should delete a card', async () => {
  // When (ACT)
  const { numDeletedRows } = await remove(card.id)

  // Then (ASSERT)
  expect(numDeletedRows).toEqual('1')
})

it('should throw an error if the card does not exist', async () => {
  const nonExistantId = cardset.id + cardOther.id

  await expect(remove(nonExistantId)).rejects.toThrowError(/not found/i)
})
