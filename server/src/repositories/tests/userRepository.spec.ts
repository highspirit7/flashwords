import config from '@server/config'
import { createTestDatabase } from '@tests/utils/database'
import { fakeUser } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import jsonwebtoken from 'jsonwebtoken'
import { pick } from 'lodash-es'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)

const fakeCreatableUser = fakeUser({
  username: 'grownuprince',
  email: 'grownuprince@gp.com',
  password: 'AbdcDefg88',
})
const [user] = await insertAll(db, 'user', [fakeUser()])
const { refreshTokenExpiresIn, refreshTokenSecret } = config.auth

describe('create', () => {
  it('should create a new user', async () => {
    const createdUser = await repository.create(fakeCreatableUser)

    expect(createdUser).toMatchObject(
      pick(fakeCreatableUser, ['username,', 'email'])
    )
  })

  it('the refreshToken of a newly created user should be null', async () => {
    const foundUser = await repository.findByEmail(user.email)

    expect(foundUser?.refreshToken).toBeNull()
  })
})

it('should find a user by the given email', async () => {
  const foundUser = await repository.findByEmail(user.email)

  expect(foundUser).toMatchObject(pick(user, ['username', 'email']))
})

describe('update', () => {
  it('should successfully set refreshToken', async () => {
    const refreshToken = jsonwebtoken.sign(
      {
        username: user.username,
        email: user.email,
      },
      refreshTokenSecret,
      { expiresIn: refreshTokenExpiresIn }
    )

    await repository.updateRefreshToken(refreshToken, user.id)
    const foundUser = await repository.findByEmail(user.email)

    expect(foundUser?.refreshToken?.slice(0, 3)).toEqual('eyJ')
  })
})
