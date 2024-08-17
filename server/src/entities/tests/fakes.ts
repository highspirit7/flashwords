import type { Cardset, Card, User, Example } from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import type { AuthUser } from '../user'

const randomId = () =>
  random.integer({
    min: 1,
    max: 1000000,
  })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    username: random.name(),
    password: 'Password.123!',
    ...overrides,
  }) satisfies Insertable<User>

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: randomId(),
  email: random.email(),
  ...overrides,
})

export const fakeCardset = <T extends Partial<Insertable<Cardset>>>(
  overrides: T = {} as T
) =>
  ({
    title: random.string(),
    description: random.string(),
    userId: randomId(),
    ...overrides,
  }) satisfies Insertable<Cardset>

export const fakeCard = <T extends Partial<Insertable<Card>>>(
  overrides: T = {} as T
) =>
  ({
    cardsetId: randomId(),
    term: random.string(),
    definition: random.string(),
    ...overrides,
  }) satisfies Insertable<Card>

export const fakeExample = <T extends Partial<Insertable<Example>>>(
  overrides: T = {} as T
) =>
  ({
    cardId: randomId(),
    content: random.string(),
    ...overrides,
  }) satisfies Insertable<Example>
