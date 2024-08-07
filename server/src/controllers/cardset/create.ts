import { cardsetRepository } from '@server/repositories/cardsetRepository'
import { cardsetSchema } from '@server/entities/cardset'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure

  // inject article repository into the ctx.repos
  .use(provideRepos({ cardsetRepository }))

  .input(
    cardsetSchema.pick({
      title: true,
      description: true,
    })
  )

  .mutation(async ({ input, ctx: { authUser, repos } }) => {
    const cardset = {
      ...input,
      userId: authUser.id,
    }

    const createdCardset = await repos.cardsetRepository.create(cardset)

    return createdCardset
  })
