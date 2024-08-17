import { z } from 'zod'
import { idSchema } from '@server/entities/shared'
import { exampleRepository } from '@server/repositories/exampleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      exampleRepository,
    })
  )
  .input(
    z.object({
      record: z.object({
        content: z.string().trim().min(1),
      }),
      exampleId: idSchema,
    })
  )
  .mutation(async ({ input: { record, exampleId }, ctx: { repos } }) => {
    const updatedResult = await repos.exampleRepository.update(
      record,
      exampleId
    )

    if (Number(updatedResult.numUpdatedRows) === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Update failed. No changes were made. The example with the specified ID may not exist.',
      })
    }

    return {
      success: true,
    }
  })
