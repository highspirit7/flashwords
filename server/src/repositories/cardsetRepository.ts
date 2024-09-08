import type { Database, Cardset } from '@server/database'
import {
  type CardsetPublicWithCardCount,
  cardsetKeysAll,
  cardsetKeysPublic,
} from '@server/entities/cardset'
import { type Insertable, sql, type Updateable } from 'kysely'
import { NotFound } from '@server/utils/errors'
import { prefixTable } from '@server/utils/strings'

type Pagination = {
  offset: number
  limit: number
}
type RecordRelationshipId = Pick<Cardset, 'userId'>

export function cardsetRepository(db: Database) {
  return {
    async create(record: Insertable<Cardset>): Promise<{ id: number }> {
      await assertRelationshipsExist(db, record)

      const createdCardset = await db
        .insertInto('cardset')
        .values(record)
        .returning(cardsetKeysAll)
        .executeTakeFirstOrThrow()

      return { id: createdCardset.id }
    },
    async findById(
      id: number
    ): Promise<CardsetPublicWithCardCount | undefined> {
      return db
        .selectFrom('cardset')
        .select([
          ...prefixTable('cardset', cardsetKeysPublic),
          sql<string>`COUNT(card.id)`.as('cardCount'),
        ])
        .leftJoin('card', 'card.cardsetId', 'cardset.id')
        .where('cardset.id', '=', id)
        .groupBy('cardset.id')
        .executeTakeFirst()
    },
    async findAllByUserId({
      offset,
      limit,
      userId,
    }: Pagination & { userId: number }): Promise<CardsetPublicWithCardCount[]> {
      return db
        .selectFrom('cardset')
        .select([
          'cardset.id',
          'cardset.title',
          'cardset.description',
          'cardset.createdAt',
          'cardset.updatedAt',
          'cardset.userId',
          sql<string>`COUNT(card.id)`.as('cardCount'),
        ])
        .leftJoin('card', 'card.cardsetId', 'cardset.id')
        .where('cardset.userId', '=', userId)
        .groupBy('cardset.id')
        .orderBy('cardset.id', 'desc')
        .offset(offset)
        .limit(limit)
        .execute()
    },
    async delete(cardsetId: number) {
      return db
        .deleteFrom('cardset')
        .where('id', '=', cardsetId)
        .executeTakeFirstOrThrow()
    },
    async update(
      record: Updateable<Pick<Cardset, 'title' | 'description'>>,
      cardsetId: number
    ) {
      return db
        .updateTable('cardset')
        .set({ ...record, updatedAt: new Date() })
        .where('id', '=', cardsetId)
        .executeTakeFirst()
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
