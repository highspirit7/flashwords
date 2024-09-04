import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'node:fs/promises'
import {
  type Kysely,
  type MigrationProvider,
  FileMigrationProvider,
  Migrator,
} from 'kysely'
import config from '@server/config'
import logger from '@server/utils/logger'
import { createDatabase } from '..'

const MIGRATIONS_PATH = '../migrations'

// To roll back migrations one step
async function migrateDown(db: Kysely<any>) {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const nodeProvider = new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(dirname, MIGRATIONS_PATH),
  })

  const { error, results } = await migrateOneStepDown(nodeProvider, db)

  if (!results?.length) {
    logger.info('No migrations to roll back.')
  }

  results?.forEach((it) => {
    if (it.status === 'Success') {
      logger.info(
        `Migration "${it.migrationName}" was roll backed successfully.`
      )
    } else if (it.status === 'Error') {
      logger.error(`Failed to roll back this migration "${it.migrationName}".`)
    }
  })

  if (error) {
    logger.error('Failed to roll back.', error)
    process.exit(1)
  }

  await db.destroy()
}

export async function migrateOneStepDown(
  provider: MigrationProvider,
  db: Kysely<any>
) {
  const migrator = new Migrator({
    db,
    provider,
  })

  return migrator.migrateDown()
}

const pathToThisFile = path.resolve(fileURLToPath(import.meta.url))
const pathPassedToNode = path.resolve(process.argv[1])
const isFileRunDirectly = pathToThisFile.includes(pathPassedToNode)

if (isFileRunDirectly) {
  const db = createDatabase(config.database)

  await migrateDown(db)
}
