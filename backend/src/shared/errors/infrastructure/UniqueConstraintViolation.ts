// shared/errors/repository/UniqueConstraintViolation.ts
import { BaseRepositoryError } from './BaseRepositoryError';

export class UniqueConstraintViolation extends BaseRepositoryError {
  readonly code = 'UNIQUE_CONSTRAINT_VIOLATION';

  constructor(field: string, value: string) {
    super(`Value "${value}" for field "${field}" already exists`);
  }
}
