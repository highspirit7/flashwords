import type { Database } from '@server/database'
import { cardsetRepository } from './cardsetRepository'
import { cardRepository } from './cardRepository'
import { userRepository } from './userRepository'
import { exampleRepository } from './exampleRepository'

export type RepositoryFactory = <T>(db: Database) => T

// index of all repositories for provideRepos
const repositories = {
  cardsetRepository,
  cardRepository,
  userRepository,
  exampleRepository,
}

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
