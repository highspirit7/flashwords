import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface User {
  createdAt: Generated<Timestamp>
  email: string
  id: Generated<number>
  password: string
  refreshToken: string | null
  updatedAt: Generated<Timestamp>
  username: string
}

export interface DB {
  user: User
}
