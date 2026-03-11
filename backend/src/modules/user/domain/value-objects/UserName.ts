export class UserName {
  constructor(private readonly name: string) {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty.')
    }
    if (name.length > 50) {
      throw new Error('Name cannot exceed 50 characters.')
    }
    this.name = name.trim()
  }

  get value(): string {
    return this.name
  }
}
