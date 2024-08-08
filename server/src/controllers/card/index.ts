import { router } from '@server/trpc'
import createAll from './createAll'
import findAllByCardsetId from './findAllByCardsetId'

export default router({
  createAll,
  findAllByCardsetId,
})
