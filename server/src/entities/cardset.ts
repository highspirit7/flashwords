import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Cardset } from '@server/database/types'
import { idSchema } from './shared'

export const cardsetSchema = z.object({
  id: idSchema,
  userId: idSchema,
  title: z.string().trim().min(1),
  description: z.string().trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const cardsetKeysAll = Object.keys(
  cardsetSchema.shape
) as (keyof Cardset)[]

export const cardsetKeysPublic = cardsetKeysAll

export type CardsetPublic = Pick<
  Selectable<Cardset>,
  (typeof cardsetKeysPublic)[number]
>

export type CardsetPublicWithCardCount = CardsetPublic & {
  cardCount: string
}
