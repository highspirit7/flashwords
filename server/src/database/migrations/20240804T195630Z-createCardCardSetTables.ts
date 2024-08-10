import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('cardset')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('title', 'text', (column) => column.notNull())
    .addColumn('description', 'text', (column) => column.notNull())
    .addColumn('user_id', 'integer', (column) =>
      column
        .references('user.id')
        .onDelete('cascade')
        .onUpdate('cascade')
        .notNull()
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  await db.schema
    .createTable('card')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('term', 'text', (column) => column.notNull())
    .addColumn('definition', 'text', (column) => column.notNull())
    .addColumn('cardset_id', 'integer', (column) =>
      column
        .references('cardset.id')
        .onDelete('cascade')
        .onUpdate('cascade')
        .notNull()
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
  await db.schema.dropTable('cardset').execute()
  await db.schema.dropTable('card').execute()
}
