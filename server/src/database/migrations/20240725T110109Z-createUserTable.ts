import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('username', 'varchar(24)', (column) => column.notNull().unique())
    .addColumn('email', 'varchar(255)', (column) => column.notNull().unique())
    .addColumn('password', 'varchar(64)', (column) => column.notNull())
    .addColumn('refresh_token', 'text', (column) =>
      column.unique().defaultTo(null)
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user').execute()
}
