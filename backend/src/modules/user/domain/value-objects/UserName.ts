export class UserName {
  private readonly _value: string;

  constructor(name: string) {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty.');
    }
    if (name.length > 50) {
      throw new Error('Name cannot exceed 50 characters.');
    }
    this._value = name.trim();
  }

  get value(): string {
    return this._value;
  }
}
