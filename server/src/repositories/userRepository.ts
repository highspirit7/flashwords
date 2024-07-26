import type { Database } from '@server/database'
import type { User } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/entities/user'
import type { Selectable } from 'kysely'
import type { CreatableUser } from '../entities/user'

export function userRepository(db: Database) {
  return {
    async create(user: CreatableUser): Promise<UserPublic> {
      return db
        .insertInto('user')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findByEmail(email: string): Promise<Selectable<User> | undefined> {
      const foundUser = await db
        .selectFrom('user')
        .select(userKeysAll)
        .where('email', '=', email)
        .executeTakeFirst()
      return foundUser
    },
    async updateRefreshToken(refreshToken: string | null, id: number) {
      await db
        .updateTable('user')
        .set({ refreshToken })
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    },
  }
}

export type UserRepository = ReturnType<typeof userRepository>
