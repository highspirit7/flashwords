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
import { authContext } from '@tests/utils/context'
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
const [example, exampleOther] = await insertAll(db, 'example', [
  fakeExample({ cardId: card.id }),
  fakeExample({ cardId: card.id }),
])

const { update } = createCaller(authContext({ db }, user))

it('should throw an error if the example matching the given exampleId does not exist ', async () => {
  await expect(
    update({
      record: { content: 'Ik zie je' },
      exampleId: example.id + exampleOther.id,
    })
  ).rejects.toThrow(/Update failed/)
})

it('should update an example successfully', async () => {
  const updatedResult = await update({
    record: { content: 'Zie je mij?' },
    exampleId: example.id,
  })

  expect(updatedResult.success).toStrictEqual(true)
})
