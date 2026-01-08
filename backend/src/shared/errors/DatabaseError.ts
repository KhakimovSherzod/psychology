import { BaseRepositoryError } from './BaseRepositoryError'

export class DatabaseError extends BaseRepositoryError {
  readonly code = 'DATABASE_ERROR'

  constructor(message: string) {
    super(`Database error: ${message}`)
  }
}
