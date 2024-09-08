import bcrypt from 'bcrypt'
import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { userSchema } from '@server/entities/user'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'

const {
  accessTokenExpiresIn,
  accessTokenSecret,
  refreshTokenExpiresIn,
  refreshTokenSecret,
} = config.auth

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema.pick({
      email: true,
      password: true,
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { repos, res } }) => {
    const user = await repos.userRepository.findByEmail(email)

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with this email address',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Please try again.',
      })
    }

    const payload = prepareTokenPayload({
      id: user.id,
    })

    const accessToken = jsonwebtoken.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    })

    const refreshToken = jsonwebtoken.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    })

    await repos.userRepository.updateRefreshToken(refreshToken, user.id)

    res?.cookie('jwt_refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })

    return {
      accessToken,
      userId: user.id,
    }
  })
