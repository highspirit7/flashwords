import { z } from 'zod'
import { idSchema } from '@server/entities/shared'
import { exampleRepository } from '@server/repositories/exampleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { POSTGRES_INT_MAX } from '@server/consts'

export default authenticatedProcedure
  .use(
    provideRepos({
      exampleRepository,
    })
  )
  .input(
    z.object({
      offset: z.number().int().min(0).max(POSTGRES_INT_MAX).default(0),
      limit: z.number().int().min(1).max(100).default(20),
      cardId: idSchema,
    })
  )
  .query(async ({ input, ctx: { repos } }) => {
    const examples = await repos.exampleRepository.findAllByCardId(input)

    return examples
  })
