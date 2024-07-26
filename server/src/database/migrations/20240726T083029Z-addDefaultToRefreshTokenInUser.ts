import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('user')
    .alterColumn('refreshToken', (ac) => ac.setDefault(null))
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('user')
    .alterColumn('refreshToken', (ac) => ac.dropDefault())
}
