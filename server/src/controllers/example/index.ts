import { router } from '@server/trpc'
import create from './create'
import findAllByCardId from './findAllByCardId'
import update from './update'
import remove from './remove'
import find from './find'

export default router({
  create,
  findAllByCardId,
  update,
  remove,
  find,
})
