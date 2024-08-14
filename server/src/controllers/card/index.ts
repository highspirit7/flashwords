import { router } from '@server/trpc'
import createAll from './createAll'
import findAllByCardsetId from './findAllByCardsetId'
import update from './update'

export default router({
  createAll,
  findAllByCardsetId,
  update,
})
