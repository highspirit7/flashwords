import { cardRepository } from '@server/repositories/cardRepository'
import { cardSchema } from '@server/entities/card'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { z } from 'zod'
import { NotFound } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ cardRepository }))
  .input(
    z.array(
      cardSchema.pick({
        term: true,
        definition: true,
        cardsetId: true,
      })
    )
  )
  .mutation(async ({ input: cards, ctx: { repos } }) => {
    try {
      const createdCards = await repos.cardRepository.createAll(cards)

      return createdCards
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
