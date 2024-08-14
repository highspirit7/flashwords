import { z } from 'zod'
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
  .input(
    z.object({
      record: z.object({
        term: z.string().optional(),
        definition: z.string().optional(),
      }),
      cardId: idSchema,
    })
  )
  .mutation(async ({ input: { record, cardId }, ctx: { repos } }) => {
    const updatedResult = await repos.cardRepository.update(record, cardId)

    if (Number(updatedResult.numUpdatedRows) === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Update failed. The card with the specified ID may not exist, or no changes were made.',
      })
    }

    return {
      success: true,
    }
  })
