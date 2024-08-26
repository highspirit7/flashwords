import { requestContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'
import userRouter from '..'

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const { refreshTokenSecret, refreshTokenExpiresIn } = config.auth

const { login, signup } = createCaller({ db })

it('should successfully verify refersh token and return a new access token', async () => {
  const exisitingUser = await signup({
    username: 'existingUser',
    email: 'existing@user.com',
    password: 'passworD.123',
  })

  const refreshToken = jsonwebtoken.sign(
    { user: { id: exisitingUser.id } },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiresIn,
    }
  )

  await login({ email: 'existing@user.com', password: 'passworD.123' })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      },
    })
  )

  const { accessToken } = await verify()

  expect(accessToken).toEqual(expect.any(String))
  expect(accessToken.slice(0, 3)).toEqual('eyJ')
})

it('throws an error when there is no refresh token in cookies', async () => {
  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: null,
        },
      },
    })
  )

  await expect(verify).rejects.toThrow(
    /Refresh token does not exist in cookies. Please log in again./
  )
})

it('throws an error when there is no found user matching the refresh token in cookies', async () => {
  const exisitingUser = await signup({
    username: 'existingUser',
    email: 'existing@user.com',
    password: 'passworD.123',
  })

  const refreshToken = jsonwebtoken.sign(
    { user: { id: exisitingUser.id } },
    'diffrent_token_secret',
    {
      expiresIn: refreshTokenExpiresIn,
    }
  )

  await login({ email: 'existing@user.com', password: 'passworD.123' })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      },
    })
  )

  await expect(verify).rejects.toThrow(
    /We could not find an account with your refresh token./
  )
})

it('throws an error when refresh token is expired', async () => {
  const exisitingUser = await signup({
    username: 'existingUser',
    email: 'existing@user.com',
    password: 'passworD.123',
  })
  const refreshToken = jsonwebtoken.sign(
    { user: { id: exisitingUser.id } },
    refreshTokenSecret,
    {
      expiresIn: '1s',
    }
  )

  // * If expriesIn of refresh token is not 1s, a different token will be generated through login
  await login({
    email: 'existing@user.com',
    password: 'passworD.123',
  })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      },
    })
  )
  await new Promise((resolve) => {
    setTimeout(resolve, 1100)
  })
  await expect(verify).rejects.toThrow(/expire/)
})
