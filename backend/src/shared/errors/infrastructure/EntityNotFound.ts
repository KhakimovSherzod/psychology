// shared/errors/repository/EntityNotFound.ts
import { BaseRepositoryError } from './BaseRepositoryError';

export class EntityNotFound extends BaseRepositoryError {
  readonly code = 'ENTITY_NOT_FOUND';

  constructor(entityName: string, identifier: string) {
    super(`${entityName} with identifier "${identifier}" not found`);
  }
}
