import { idSchema } from '@server/entities/shared'
import { cardsetRepository } from '@server/repositories/cardsetRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import serializeBigInt from '@server/utils/serializeBigInt'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ cardsetRepository }))
  .input(idSchema)
  .mutation(async ({ input: cardsetId, ctx: { repos, authUser } }) => {
    const cardset = await repos.cardsetRepository.findById(cardsetId)

    if (!cardset) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Cardset was not found',
      })
    }

    if (cardset.userId !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'This authenticated user does not have permission to access this cardset',
      })
    }

    const result = await repos.cardsetRepository.delete(cardsetId)

    return serializeBigInt(result)
  })
