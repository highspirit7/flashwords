// import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
// TODO : userLogout.spec.ts
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'

// ?  authenticatedProcecure or publicProcedure for logout
// What if a user click logout button after the access token is expired. Normally I should regenerate access token by verifying the refresh token. but is that process really necessary
export default publicProcedure
  .use(provideRepos({ userRepository }))
  .mutation(async ({ ctx: { repos, req, res } }) => {
    const cookies = req?.cookies

    if (!cookies?.jwt_refresh) return null

    const refreshToken = cookies.jwt_refresh
    const foundUser =
      await repos.userRepository.findByRefreshToken(refreshToken)

    if (!foundUser) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "Invalid refresh token. Can't logout for this account.",
      })
    }

    await repos.userRepository.updateRefreshToken(null, foundUser.id)

    res?.clearCookie('jwt_refresh', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    return null
  })
