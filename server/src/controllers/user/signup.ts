import { hash } from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { assertError } from '@server/utils/errors'
import { userSchema } from '@server/entities/user'
import logger from '@server/utils/logger'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema.pick({
      email: true,
      password: true,
      username: true,
    })
  )
  .mutation(async ({ input: user, ctx: { repos } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost)

    const userCreated = await repos.userRepository
      .create({
        ...user,
        password: passwordHash,
      })
      // handling errors using the Promise.catch method
      .catch((error: unknown) => {
        assertError(error)

        if (error.message.includes('duplicate key')) {
          const duplicatedKey = error.message.includes('email')
            ? 'email'
            : 'username'

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `User with this ${duplicatedKey} already exists`,
            cause: error,
          })
        }
        logger.error(error)
        throw error
      })

    return {
      id: userCreated.id,
    }
  })
