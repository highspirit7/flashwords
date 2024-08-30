import Chance from 'chance'
import { requestContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'
import userRouter from '..'

const chance = new Chance()

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const { refreshTokenSecret, refreshTokenExpiresIn } = config.auth

const { login, signup } = createCaller({ db })

it('should successfully verify refersh token and return a new access token', async () => {
  const testEmail = `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`
  const testUsername = chance.name().replaceAll(' ', '')
  const VALID_PASSWORD = 'Testuser123'

  const newUser = await signup({
    username: testUsername,
    email: testEmail,
    password: VALID_PASSWORD,
  })
  const refreshToken = jsonwebtoken.sign(
    { user: { id: newUser.id } },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiresIn,
    }
  )

  await login({
    email: testEmail,
    password: VALID_PASSWORD,
  })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      } as any,
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
      } as any,
    })
  )

  await expect(verify).rejects.toThrow(
    /Refresh token does not exist in cookies. Please log in again./
  )
})

it('throws an error when there is no found user matching the refresh token in cookies', async () => {
  const testEmail = `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`
  const testUsername = chance.name().replaceAll(' ', '')
  const VALID_PASSWORD = 'Testuser123'

  const newUser = await signup({
    username: testUsername,
    email: testEmail,
    password: VALID_PASSWORD,
  })

  const refreshToken = jsonwebtoken.sign(
    { user: { id: newUser.id } },
    'diffrent_token_secret',
    {
      expiresIn: refreshTokenExpiresIn,
    }
  )

  await login({ email: testEmail, password: VALID_PASSWORD })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      } as any,
    })
  )

  await expect(verify).rejects.toThrow(
    /We could not find an account with your refresh token./
  )
})

it('throws an error when refresh token is expired', async () => {
  vi.useFakeTimers()

  const testEmail = `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`
  const testUsername = chance.name().replaceAll(' ', '')
  const VALID_PASSWORD = 'Testuser123'

  const newUser = await signup({
    username: testUsername,
    email: testEmail,
    password: VALID_PASSWORD,
  })
  const refreshToken = jsonwebtoken.sign(
    { user: { id: newUser.id } },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiresIn,
    }
  )

  // * If expriesIn of refresh token is not same, a different token will be generated through login
  await login({
    email: testEmail,
    password: VALID_PASSWORD,
  })

  const { verify } = createCaller(
    requestContext({
      db,
      req: {
        cookies: {
          jwt_refresh: refreshToken,
        },
      } as any,
    })
  )

  vi.advanceTimersByTime(1000 * 61)
  await expect(verify).rejects.toThrow(/expire/)
})
