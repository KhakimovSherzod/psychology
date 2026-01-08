

// shared/errors/repository/BaseRepositoryError.ts
export abstract class BaseRepositoryError extends Error {
  abstract readonly code: string;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // fix instanceof
  }
}
