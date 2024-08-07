import { z } from 'zod'
import { idSchema } from '@server/entities/shared'
import { cardsetRepository } from '@server/repositories/cardsetRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { POSTGRES_INT_MAX } from '@server/consts'

export default authenticatedProcedure
  .use(
    provideRepos({
      cardsetRepository,
    })
  )
  .input(
    z.object({
      offset: z.number().int().min(0).max(POSTGRES_INT_MAX).default(0),
      limit: z.number().int().min(1).max(100).default(20),
      userId: idSchema,
    })
  )
  .query(async ({ input, ctx: { repos } }) => {
    const cardsets = await repos.cardsetRepository.findAllByUserId(input)

    return cardsets
  })
