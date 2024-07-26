import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { User } from '@server/database/types'
import { idSchema } from './shared'

export const userSchema = z.object({
  id: idSchema,
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long')
    .regex(/[A-Z]/, {
      message: 'Password must include at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must include at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must include at least one number' }),
  username: z.string().min(4).max(24),
  refreshToken: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// list keys that we will return to the client
export const userKeysAll = Object.keys(userSchema.shape) as (keyof User)[]

export const userKeysPublic = [
  'id',
  'username',
  'email',
  'createdAt',
  'updatedAt',
] as const

export type UserPublic = Pick<Selectable<User>, (typeof userKeysPublic)[number]>

// a specific schema for authenticated user that is used in JWT
export const authUserSchema = userSchema.pick({ id: true })
export type AuthUser = z.infer<typeof authUserSchema>
