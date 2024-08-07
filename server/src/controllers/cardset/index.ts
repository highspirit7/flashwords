import { router } from '@server/trpc'
import create from './create'
import findAllByUserId from './findAllByUserId'

export default router({
  create,
  findAllByUserId,
})
