import { router } from '@server/trpc'
import createAll from './createAll'
import findAllByCardsetId from './findAllByCardsetId'
import update from './update'
import remove from './remove'
import find from './find'

export default router({
  createAll,
  findAllByCardsetId,
  update,
  remove,
  find,
})
