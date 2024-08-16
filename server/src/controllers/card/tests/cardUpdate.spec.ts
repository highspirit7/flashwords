import { fakeCardset, fakeUser, fakeCard } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { authContext } from '@tests/utils/context'
import cardRouter from '..'

const createCaller = createCallerFactory(cardRouter)
const db = await wrapInRollbacks(createTestDatabase())

const [user] = await insertAll(db, 'user', fakeUser())
const [cardset] = await insertAll(
  db,
  'cardset',
  fakeCardset({ userId: user.id })
)
const [card] = await insertAll(db, 'card', fakeCard({ cardsetId: cardset.id }))

const { update } = createCaller(authContext({ db }, user))

it('should throw an error if the card matching the given cardId does not exist ', async () => {
  await expect(
    update({ record: { term: 'hand' }, cardId: card.id + 11111 })
  ).rejects.toThrow(/Update failed/)
})

it('should update a card successfully', async () => {
  const updatedResult = await update({
    record: { term: 'hand' },
    cardId: card.id,
  })

  expect(updatedResult.success).toStrictEqual(true)
})
