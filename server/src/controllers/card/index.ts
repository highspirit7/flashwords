import { router } from '@server/trpc'
import createAll from './createAll'
import findAllByCardsetId from './findAllByCardsetId'
import update from './update'
import remove from './remove'

export default router({
  createAll,
  findAllByCardsetId,
  update,
  remove,
})
