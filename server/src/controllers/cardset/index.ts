import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import find from './find'
import remove from './remove'
import update from './update'

export default router({
  create,
  findAll,
  find,
  remove,
  update,
})
