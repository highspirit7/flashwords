export function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw error
  }
}

export class NotFound extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}
