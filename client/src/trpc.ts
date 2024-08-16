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
          if (response.status === 401) {
            const toasterStore = useToasterStore()
            const authStore = useAuthStore()

            try {
              await authStore.verifyWithRefreshToken()

              const newToken = authStore.authToken
              if (newToken) {
                const headers = options?.headers as Record<string, string>

                headers['Authorization'] = `Bearer ${newToken}`
                console.log('set a new access token to header')
                return fetch(url, options)
              }
            } catch (error: unknown) {
              handleAuthenticationError(error, toasterStore, authStore)
            }
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

function handleAuthenticationError(
  error: unknown,
  toasterStore: ReturnType<typeof useToasterStore>,
  authStore: ReturnType<typeof useAuthStore>,
) {
  if (error instanceof TRPCClientError) {
    const errorMessage =
      error.data?.httpStatus === 401
        ? error.message.includes('does not exist')
          ? 'Please log in first.'
          : 'Your session has expired. Please log in again.'
        : DEFAULT_SERVER_ERROR
    toasterStore.danger({ text: errorMessage })
  } else {
    assertError(error)
    toasterStore.danger({ text: 'Please log in' })
  }

  authStore.logout()
}

export { publicTrpc, authTrpc }
