import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Card {
  cardsetId: number
  createdAt: Generated<Timestamp>
  definition: string
  id: Generated<number>
  term: string
  updatedAt: Generated<Timestamp>
}

export interface Cardset {
  createdAt: Generated<Timestamp>
  description: string
  id: Generated<number>
  title: string
  updatedAt: Generated<Timestamp>
  userId: number
}

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
  card: Card
  cardset: Cardset
  user: User
}
