import type { Database, Card } from '@server/database'
import { type CardPublic, cardKeysAll } from '@server/entities/card'
import { NotFound } from '@server/utils/errors'
import { type Insertable } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}
type RecordRelationshipId = Pick<Card, 'cardsetId'>

export function cardRepository(db: Database) {
  return {
    async create(record: Insertable<Card>): Promise<CardPublic> {
      await assertRelationshipsExist(db, record)
      return db
        .insertInto('card')
        .values(record)
        .returning(cardKeysAll)
        .executeTakeFirstOrThrow()
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
        .orderBy('id', 'desc')
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
