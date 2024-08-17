import { idSchema } from '@server/entities/shared'
import { exampleRepository } from '@server/repositories/exampleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      exampleRepository,
    })
  )
  .input(idSchema)
  .query(async ({ input: cardId, ctx: { repos } }) => {
    const example = await repos.exampleRepository.findById(cardId)

    if (!example) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Example was not found',
      })
    }

    return example
  })
