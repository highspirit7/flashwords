import { cardRepository } from '@server/repositories/cardRepository'
import { cardSchema } from '@server/entities/card'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ cardRepository }))
  .input(
    cardSchema.pick({
      term: true,
      definition: true,
      cardsetId: true,
    })
  )
  .mutation(async ({ input: card, ctx: { repos } }) => {
    const createdCardset = await repos.cardRepository.create(card)

    return createdCardset
  })
