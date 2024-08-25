import { z } from 'zod'
import { idSchema } from '@server/entities/shared'
import { cardRepository } from '@server/repositories/cardRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { POSTGRES_INT_MAX } from '@server/consts'

export default authenticatedProcedure
  .use(
    provideRepos({
      cardRepository,
    })
  )
  .input(
    z.object({
      offset: z.number().int().min(0).max(POSTGRES_INT_MAX).default(0),
      limit: z.number().int().min(1).max(100).default(20),
      cardsetId: idSchema,
    })
  )
  .query(async ({ input, ctx: { repos } }) => {
    // if use try catch -> 200 response
    // without try catch -> 500 response

    const cards = await repos.cardRepository.findAllByCardsetId(input)
    return cards
  })
