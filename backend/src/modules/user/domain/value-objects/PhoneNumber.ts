export class PhoneNumber {
  constructor(private readonly phone: string) {
    if (!/^\+?\d{8,15}$/.test(phone)) {
      throw new Error('Invalid phone number.')
    }
    this.phone = phone
  }

  get value(): string {
    return this.phone
  }
}
