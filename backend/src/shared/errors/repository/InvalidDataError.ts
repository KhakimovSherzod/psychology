// shared/errors/repository/InvalidDataError.ts
import { BaseRepositoryError } from '../BaseRepositoryError'

export class InvalidDataError extends BaseRepositoryError {
  readonly code = 'INVALID_DATA'

  constructor(message: string) {
    super(message)
  }
}
