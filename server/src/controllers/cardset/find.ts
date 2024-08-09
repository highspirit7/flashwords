import { idSchema } from '@server/entities/shared'
import { cardsetRepository } from '@server/repositories/cardsetRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      cardsetRepository,
    })
  )
  .input(idSchema)
  .query(async ({ input: cardsetId, ctx: { repos } }) => {
    const cardset = await repos.cardsetRepository.findById(cardsetId)

    if (!cardset) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Cardset was not found',
      })
    }

    return cardset
  })
