import { idSchema } from '@server/entities/shared'
import { cardRepository } from '@server/repositories/cardRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ cardRepository }))
  .input(idSchema)
  .mutation(async ({ input: cardId, ctx: { repos } }) => {
    const result = await repos.cardRepository.delete(cardId)

    if (Number(result.numDeletedRows) === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Deletion failed. The card with the specified ID may not exist.',
      })
    }

    return {
      success: true,
    }
  })
