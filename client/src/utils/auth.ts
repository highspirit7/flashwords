import { TRPCClientError } from '@trpc/client'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import type { useToasterStore } from '@/stores/toaster'
import type { AuthUser } from '@server/shared/types'
import { assertError } from '@/utils/errors'

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id
}

export function handleAuthenticationError(
  error: unknown,
  toasterStore: ReturnType<typeof useToasterStore>,
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
}
