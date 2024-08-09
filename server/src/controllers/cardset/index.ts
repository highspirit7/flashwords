import { router } from '@server/trpc'
import create from './create'
import findAll from './findAll'
import find from './find'

export default router({
  create,
  findAll,
  find,
})
