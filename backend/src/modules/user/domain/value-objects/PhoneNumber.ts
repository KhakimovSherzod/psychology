export class PhoneNumber {
  private readonly _value: string;

  constructor(phone: string) {
    if (!/^\+?\d{8,15}$/.test(phone)) {
      throw new Error('Invalid phone number.');
    }
    this._value = phone;
  }

  get value(): string {
    return this._value;
  }
}
