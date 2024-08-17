import { idSchema } from '@server/entities/shared'
import { exampleRepository } from '@server/repositories/exampleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ exampleRepository }))
  .input(idSchema)
  .mutation(async ({ input: exampleId, ctx: { repos } }) => {
    const result = await repos.exampleRepository.delete(exampleId)

    if (Number(result.numDeletedRows) === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Deletion failed. The example with the specified ID may not exist.',
      })
    }

    return {
      success: true,
    }
  })
