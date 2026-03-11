export abstract class BaseDomainError extends Error {
  abstract readonly code: string

  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
