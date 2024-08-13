import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import find from './find'
import remove from './remove'

export default router({
  create,
  findAll,
  find,
  remove,
})
