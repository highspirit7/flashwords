import { z } from 'zod'
import type { Selectable } from 'kysely'
import { idSchema } from './shared'
import type { Cardset } from '@server/database/types'

export const cardsetSchema = z.object({
  id: idSchema,
  userId: idSchema,
  title: z.string().trim(),
  description: z.string().trim().optional(),
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
