import type { AuthUser } from '@server/shared/types'

// This is a simplified version of auth functions without error handling.

export function getUserFromToken(token: string): AuthUser {
  return JSON.parse(atob(token.split('.')[1])).user
}

export function getUserIdFromToken(token: string) {
  return getUserFromToken(token).id
}
