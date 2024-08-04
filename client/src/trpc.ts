import { createTRPCProxyClient, httpBatchLink, TRPCClientError } from '@trpc/client'
import useAuthStore from '@/stores/auth'
import { useToasterStore } from './stores/toaster'
import type { AppRouter } from '@server/shared/trpc'
import SuperJSON from 'superjson'
import { apiBase } from './config'
import { DEFAULT_SERVER_ERROR } from './consts'
import { assertError } from './utils/errors'

const publicTrpc = createTRPCProxyClient<AppRouter>({
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
    }),
  ],
})

const authTrpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        }).then(async response => {
          const authStore = useAuthStore()

          // TODO : Need to test this part once this app can make authenticate request
          if (response.status === 401) {
            await renewAccessToken()

            const newToken = authStore.authToken
            if (newToken) {
              const headers = options?.headers as Record<string, string>

              headers['Authorization'] = `Bearer ${newToken}`
              console.log('set a new access token to header')
            }

            return fetch(url, options)
          }

          return response
        })
      },
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

async function renewAccessToken() {
  const toasterStore = useToasterStore()
  const authStore = useAuthStore()

  try {
    await authStore.verifyWithRefreshToken()
  } catch (error: unknown) {
    authStore.logout()

    if (error instanceof TRPCClientError) {
      if (error.data?.httpStatus === 401) {
        toasterStore.danger({ text: 'Your session has expired. Please log in again.' })
      } else {
        toasterStore.danger({ text: DEFAULT_SERVER_ERROR })
      }
    }

    assertError(error)
    toasterStore.danger({ text: error.message })
  }
}

export { publicTrpc, authTrpc }
