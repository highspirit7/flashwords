import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Example } from '@server/database/types'
import { idSchema } from './shared'

export const exampleSchema = z.object({
  id: idSchema,
  cardId: idSchema,
  content: z.string().trim().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const exampleKeysAll = Object.keys(
  exampleSchema.shape
) as (keyof Example)[]

export const exampleKeysPublic = exampleKeysAll

export type ExamplePublic = Pick<
  Selectable<Example>,
  (typeof exampleKeysPublic)[number]
>
