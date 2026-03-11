import { BaseRepositoryError } from './BaseRepositoryError'

export class UserMappingError extends BaseRepositoryError {
  readonly code = 'USER_MAPPING_ERROR'

  constructor(message: string) {
    super(`User mapping error: ${message}`)
  }
}
