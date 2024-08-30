import { createTestDatabase } from '@tests/utils/database'
import { fakeExample } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { clearTables, insertAll } from '@tests/utils/records'
import { POSTGRES_INT_MAX } from '@server/consts'
import presetDataInfo from '@tests/utils/presetDataInfo'
import { exampleRepository } from '../exampleRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = exampleRepository(db)
const { cards } = presetDataInfo

beforeEach(async () => {
  await clearTables(db, ['example'])
})

describe('create', () => {
  it('should create a example matching a given cardId', async () => {
    const createdExample = await repository.create(
      fakeExample({ cardId: cards[0].id, content: 'Ik hou van jou' })
    )

    expect(createdExample).toEqual({
      id: expect.any(Number),
      content: 'Ik hou van jou',
      cardId: cards[0].id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('throw an error if referenced card does not exist', async () => {
    await expect(
      repository.create(fakeExample({ cardId: POSTGRES_INT_MAX }))
    ).rejects.toThrow(/Referenced card matching cardId does not exist/)
  })
})

describe('findAllByCardId', () => {
  it('should return an empty array when there are no examples for the card with the given cardId', async () => {
    const examples = await repository.findAllByCardId({
      offset: 0,
      limit: 5,
      cardId: 1,
    })

    expect(examples).toEqual([])
  })

  it('should return examples by the given cardId', async () => {
    await insertAll(db, 'example', [
      fakeExample({ cardId: cards[0].id, content: 'Wat lekker!' }),
      fakeExample({ cardId: cards[0].id, content: 'Je bent mooi' }),
    ])

    const examples = await repository.findAllByCardId({
      offset: 0,
      limit: 5,
      cardId: cards[0].id,
    })

    expect(examples).toHaveLength(2)
    expect(examples[0]).toEqual({
      id: expect.any(Number),
      cardId: cards[0].id,
      content: 'Wat lekker!',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
    expect(examples[1]).toEqual({
      id: expect.any(Number),
      cardId: cards[0].id,
      content: 'Je bent mooi',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should return 3 examples with setting limit as 3', async () => {
    await insertAll(db, 'example', [
      fakeExample({ cardId: cards[0].id }),
      fakeExample({ cardId: cards[0].id }),
      fakeExample({ cardId: cards[0].id }),
      fakeExample({ cardId: cards[0].id }),
      fakeExample({ cardId: cards[0].id }),
    ])

    const examples = await repository.findAllByCardId({
      offset: 0,
      limit: 3,
      cardId: cards[0].id,
    })

    expect(examples).toHaveLength(3)
  })
})

describe('update', async () => {
  it('should update the example with the given exampleId', async () => {
    const [example] = await insertAll(db, 'example', [
      fakeExample({
        cardId: cards[0].id,
      }),
    ])

    const updateResult = await repository.update(
      { content: 'Ik en je' },
      example.id
    )

    expect(Number(updateResult.numUpdatedRows)).toEqual(1)
  })

  it('should return 0 numUpdatedRows if there is no matching example with the given exampleId', async () => {
    await insertAll(db, 'example', [
      fakeExample({
        cardId: cards[0].id,
      }),
    ])

    const updateResult = await repository.update(
      { content: 'huis' },
      POSTGRES_INT_MAX
    )

    expect(Number(updateResult.numUpdatedRows)).toEqual(0)
  })
})

describe('delete', () => {
  it('the number of deleted rows would be 0 if there is no matching example with the given id', async () => {
    const { numDeletedRows } = await repository.delete(POSTGRES_INT_MAX)

    expect(Number(numDeletedRows)).toEqual(0)
  })

  it('should delete a example with the given id', async () => {
    const [example] = await insertAll(db, 'example', [
      fakeExample({
        cardId: cards[0].id,
      }),
    ])

    const { numDeletedRows } = await repository.delete(example.id)

    expect(Number(numDeletedRows)).toEqual(1)
  })
})
