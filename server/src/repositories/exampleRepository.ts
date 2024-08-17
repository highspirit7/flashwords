import type { Database, Example } from '@server/database'
import { exampleKeysAll, type ExamplePublic } from '@server/entities/example'
import { NotFound } from '@server/utils/errors'
import { type Insertable, type Updateable } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}
type RecordRelationshipId = Pick<Example, 'cardId'>

export function exampleRepository(db: Database) {
  return {
    async create(record: Insertable<Example>): Promise<ExamplePublic> {
      await assertRelationshipsExist(db, record)

      return db
        .insertInto('example')
        .values(record)
        .returning(exampleKeysAll)
        .executeTakeFirstOrThrow()
    },
    async findById(id: number): Promise<ExamplePublic | undefined> {
      return db
        .selectFrom('example')
        .select(exampleKeysAll)
        .where('id', '=', id)
        .executeTakeFirst()
    },
    async update(record: Updateable<Pick<Example, 'content'>>, cardId: number) {
      return db
        .updateTable('example')
        .set({ ...record, updatedAt: new Date() })
        .where('id', '=', cardId)
        .executeTakeFirst()
    },
    async findAllByCardId({
      offset,
      limit,
      cardId,
    }: Pagination & { cardId: number }) {
      return db
        .selectFrom('example')
        .select(exampleKeysAll)
        .where('cardId', '=', cardId)
        .offset(offset)
        .limit(limit)
        .execute()
    },
    async delete(exampleId: number) {
      return db
        .deleteFrom('example')
        .where('id', '=', exampleId)
        .executeTakeFirstOrThrow()
    },
  }
}

async function assertRelationshipsExist(
  db: Database,
  record: RecordRelationshipId
) {
  const { cardId } = record

  if (cardId) {
    const card = await db
      .selectFrom('card')
      .select('id')
      .where('id', '=', cardId)
      .executeTakeFirst()

    if (!card) {
      throw new NotFound('Referenced card matching cardId does not exist')
    }
  }
}

export type ExampleRepository = ReturnType<typeof exampleRepository>
