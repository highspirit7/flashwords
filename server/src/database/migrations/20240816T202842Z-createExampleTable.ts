import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('example')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('content', 'text', (column) => column.notNull())
    .addColumn('card_id', 'integer', (column) =>
      column
        .references('card.id')
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
  await db.schema.dropTable('example').execute()
}
