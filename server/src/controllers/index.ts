import { router } from '../trpc'
import cardset from './cardset'
import card from './card'
import user from './user'
import example from './example'

export const appRouter = router({
  cardset,
  card,
  user,
  example,
})

export type AppRouter = typeof appRouter
