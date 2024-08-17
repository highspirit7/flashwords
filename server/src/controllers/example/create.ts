import { z } from 'zod'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { NotFound } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'
import { idSchema } from '@server/entities/shared'
import { exampleRepository } from '@server/repositories/exampleRepository'

export default authenticatedProcedure
  .use(provideRepos({ exampleRepository }))
  .input(
    z.object({
      content: z.string().trim().min(1),
      cardId: idSchema,
    })
  )
  .mutation(async ({ input, ctx: { repos } }) => {
    try {
      const createdExample = await repos.exampleRepository.create(input)
      return createdExample
    } catch (error) {
      if (error instanceof NotFound) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        })
      }

      throw error
    }
  })
