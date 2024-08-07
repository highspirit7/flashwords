import { router } from '@server/trpc'
import create from './create'
import findAllByCardsetId from './findAllByCardsetId'

export default router({
  create,
  findAllByCardsetId,
})
