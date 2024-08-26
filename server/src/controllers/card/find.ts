import { idSchema } from '@server/entities/shared'

import { cardRepository } from '@server/repositories/cardRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      cardRepository,
    })
  )
  .input(idSchema)
  .query(async ({ input: cardId, ctx: { repos } }) => {
    const card = await repos.cardRepository.findById(cardId)

    if (!card) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Card was not found',
      })
    }

    return card
  })
