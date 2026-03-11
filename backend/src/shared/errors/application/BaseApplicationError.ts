export abstract class BaseApplicationError extends Error {
  abstract readonly code: string;

    constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // fix instanceof
  }
}
