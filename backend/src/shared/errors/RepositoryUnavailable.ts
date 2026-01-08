// shared/errors/repository/RepositoryUnavailable.ts
import { BaseRepositoryError } from '../BaseRepositoryError'

export class RepositoryUnavailable extends BaseRepositoryError {
  readonly code = 'REPOSITORY_UNAVAILABLE'

  constructor(message = 'Repository is unavailable or database connection failed') {
    super(message)
  }
}
