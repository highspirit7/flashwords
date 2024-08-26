import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'

const { accessTokenExpiresIn, accessTokenSecret, refreshTokenSecret } =
  config.auth

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .mutation(async ({ ctx: { repos, req } }) => {
    const cookies = req?.cookies

    if (!cookies?.jwt_refresh) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'Refresh token does not exist in cookies. Please log in again.',
      })
    }

    const refreshToken = cookies.jwt_refresh

    const foundUser =
      await repos.userRepository.findByRefreshToken(refreshToken)

    if (!foundUser) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with your refresh token.',
      })
    }

    const decoded = jsonwebtoken.verify(
      refreshToken,
      refreshTokenSecret
    ) as JwtPayload

    if (foundUser.id !== decoded.user.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'User data does not match decoded user data from refresh token',
      })
    }

    const payload = prepareTokenPayload({
      id: foundUser.id,
    })

    const accessToken = jsonwebtoken.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    })

    return {
      accessToken,
    }
  })
