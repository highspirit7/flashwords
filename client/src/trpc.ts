import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'
import useAuthStore from '@/stores/auth'
import type { AppRouter } from '@server/shared/trpc'
import { useToasterStore } from '@/stores/toaster'
import { apiBase } from './config'
import { handleAuthenticationError } from '@/utils/auth'
import { useRouter } from 'vue-router'

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
            const router = useRouter()

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
              handleAuthenticationError(error, toasterStore)
              authStore.$reset()
              router.replace('/login')
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

// function handleAuthenticationError(
//   error: unknown,
//   toasterStore: ReturnType<typeof useToasterStore>,
//   authStore: ReturnType<typeof useAuthStore>,
// ) {
//   const router = useRouter()

//   if (error instanceof TRPCClientError) {
//     const errorMessage =
//       error.data?.httpStatus === 401
//         ? error.message.includes('does not exist')
//           ? 'Please log in first.'
//           : 'Your session has expired. Please log in again.'
//         : DEFAULT_SERVER_ERROR
//     toasterStore.danger({ text: errorMessage })
//   } else {
//     assertError(error)
//     toasterStore.danger({ text: 'Please log in' })
//   }

//   // No need to show logout toast at this point
//   // No need to execute server's logout api at this point
//   authStore.$reset()
//   router.replace('/login')
// }

export { publicTrpc, authTrpc }
