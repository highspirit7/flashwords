import { router } from '../trpc'
import cardset from './cardset'
import card from './card'
import user from './user'

export const appRouter = router({
  cardset,
  card,
  user,
})

export type AppRouter = typeof appRouter
