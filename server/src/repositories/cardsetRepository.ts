import type { Database, Cardset } from '@server/database'
import { type CardsetPublic, cardsetKeysAll } from '@server/entities/cardset'
import type { Insertable } from 'kysely'
import { NotFound } from '@server/utils/errors'

type Pagination = {
  offset: number
  limit: number
}
type RecordRelationshipId = Pick<Cardset, 'userId'>

export function cardsetRepository(db: Database) {
  return {
    async create(record: Insertable<Cardset>): Promise<CardsetPublic> {
      await assertRelationshipsExist(db, record)

      return db
        .insertInto('cardset')
        .values(record)
        .returning(cardsetKeysAll)
        .executeTakeFirstOrThrow()
    },

    async findAllByUserId({
      offset,
      limit,
      userId,
    }: Pagination & { userId: number }): Promise<CardsetPublic[]> {
      return db
        .selectFrom('cardset')
        .select(cardsetKeysAll)
        .where('userId', '=', userId)
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
  const { userId } = record

  if (userId) {
    const user = await db
      .selectFrom('user')
      .select('id')
      .where('id', '=', userId)
      .executeTakeFirst()

    if (!user) {
      throw new NotFound('Referenced user matching userId does not exist')
    }
  }
}

export type CardsetRepository = ReturnType<typeof cardsetRepository>
