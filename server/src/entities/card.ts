import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Card } from '@server/database/types'
import { idSchema } from './shared'

export const cardSchema = z.object({
  id: idSchema,
  cardsetId: idSchema,
  term: z.string().trim(),
  definition: z.string().trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const cardKeysAll = Object.keys(cardSchema.shape) as (keyof Card)[]

export const cardKeysPublic = cardKeysAll

export type CardPublic = Pick<Selectable<Card>, (typeof cardKeysPublic)[number]>
