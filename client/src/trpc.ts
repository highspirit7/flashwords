import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import useAuthStore from '@/stores/auth'
import type { AppRouter } from '@server/shared/trpc'
import SuperJSON from 'superjson'
import { apiBase } from './config'

const trpc = createTRPCProxyClient<AppRouter>({
  // auto convert Date <-> string
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
      // send the access token with every request
      headers: () => {
        const authStore = useAuthStore()
        const token = authStore.authToken

        if (!token) return {}

        return {
          Authorization: `Bearer ${token}`,
        }
      },
    }),
  ],
})

export default trpc
