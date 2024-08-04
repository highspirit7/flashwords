import config from '@server/config'
import { TRPCError } from '@trpc/server'
import jsonwebtoken from 'jsonwebtoken'
import { parseTokenPayload } from '@server/trpc/tokenPayload'
import { publicProcedure } from '..'

const { accessTokenSecret } = config.auth

function verifyAccessToken(token: string) {
  return jsonwebtoken.verify(token, accessTokenSecret)
}

function getUserFromToken(accessToken: string) {
  try {
    const tokenVerified = verifyAccessToken(accessToken)
    const tokenParsed = parseTokenPayload(tokenVerified)

    return tokenParsed.user
  } catch (error) {
    return null
  }
}

export const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (ctx.authUser) {
    // If we have an authenticated user, we can proceed.
    return next({
      ctx: {
        // This is a bit of a type hack.
        // At this point ctx.authUser is AuthUser (no longer undefined).
        // If we make sure that this middleware always returns
        // ctx with authUser not undefined, then all routes using this
        // middleware will also know that authUser is defined.
        authUser: ctx.authUser,
      },
    })
  }

  // we depend on having an Express request object
  if (!ctx.req) {
    const message =
      config.env === 'development' || config.env === 'test'
        ? 'Missing Express request object. If you are running tests, make sure to provide some req object in the procedure context.'
        : 'Missing Express request object.'

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message,
    })
  }

  // if we do not have an authenticated user, we will try to authenticate
  const accessToken = ctx.req.header('Authorization')?.replace('Bearer ', '')

  // if there is no token, we will throw an error
  if (!accessToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthenticated. Please log in.',
    })
  }

  const authUser = getUserFromToken(accessToken)

  if (!authUser) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid access token.',
    })
  }

  return next({
    ctx: {
      authUser,
    },
  })
})
