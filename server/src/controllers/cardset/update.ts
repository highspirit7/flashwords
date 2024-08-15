import { z } from 'zod'
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
  .input(
    z.object({
      record: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
      cardsetId: idSchema,
    })
  )
  .mutation(async ({ input: { record, cardsetId }, ctx: { repos } }) => {
    const updatedResult = await repos.cardsetRepository.update(
      record,
      cardsetId
    )

    if (Number(updatedResult.numUpdatedRows) === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Update failed. The cardset with the specified ID may not exist, or no changes were made.',
      })
    }

    return {
      success: true,
    }
  })
