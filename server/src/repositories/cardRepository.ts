import type { Database, Card } from '@server/database'
import { type CardPublic, cardKeysAll } from '@server/entities/card'
import { NotFound } from '@server/utils/errors'
import { type Insertable, type Updateable } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}
type RecordRelationshipId = Pick<Card, 'cardsetId'>

export function cardRepository(db: Database) {
  return {
    async createAll(record: Insertable<Card>[]): Promise<CardPublic[]> {
      await assertRelationshipsExist(db, record[0])

      return db
        .insertInto('card')
        .values(record)
        .returning(cardKeysAll)
        .execute()
    },
    async update(
      record: Updateable<Pick<Card, 'term' | 'definition'>>,
      cardId: number
    ) {
      return db
        .updateTable('card')
        .set(record)
        .where('id', '=', cardId)
        .executeTakeFirst()
    },
    async findAllByCardsetId({
      offset,
      limit,
      cardsetId,
    }: Pagination & { cardsetId: number }) {
      return db
        .selectFrom('card')
        .select(cardKeysAll)
        .where('cardsetId', '=', cardsetId)
        .offset(offset)
        .limit(limit)
        .execute()
    },
  }
}

async function assertRelationshipsExist(
  db: Database,
  record: RecordRelationshipId
) {
  const { cardsetId } = record

  if (cardsetId) {
    const cardset = await db
      .selectFrom('cardset')
      .select('id')
      .where('id', '=', cardsetId)
      .executeTakeFirst()

    if (!cardset) {
      throw new NotFound('Referenced cardset matching cardsetId does not exist')
    }
  }
}

export type CardRepository = ReturnType<typeof cardRepository>
