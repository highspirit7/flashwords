import { z } from 'zod'
import { cardsetRepository } from '@server/repositories/cardsetRepository'
import { cardsetSchema } from '@server/entities/cardset'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { cardSchema, type CardPublic } from '@server/entities/card'
import { cardRepository } from '@server/repositories/cardRepository'
import { NotFound } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'

type CreatableCard = Pick<CardPublic, 'cardsetId' | 'term' | 'definition'>

export default authenticatedProcedure
  .use(provideRepos({ cardsetRepository, cardRepository }))

  .input(
    z.object({
      cardset: cardsetSchema.pick({
        title: true,
        description: true,
      }),
      cards: z.array(
        cardSchema.pick({
          term: true,
          definition: true,
        })
      ),
    })
  )
  .mutation(async ({ input: { cardset, cards }, ctx: { authUser, repos } }) => {
    try {
      const createdCardset = await repos.cardsetRepository.create({
        ...cardset,
        userId: authUser.id,
      })

      const cardsWithCardsetId: CreatableCard[] = cards.map((card) => ({ ...card, cardsetId: createdCardset.id }))

      await repos.cardRepository.createAll(cardsWithCardsetId)

      return createdCardset
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
