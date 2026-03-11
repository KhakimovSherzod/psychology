export class Category {
  constructor(
    private readonly uuid: string,
    private name: string,
    private createdAt: Date,
    private updatedAt: Date,
    private deletedAt?: Date,
    private internalId?:number
  ) {}

  get id(): string {
    return this.uuid
  }

  get nameValue(): string {
    return this.name
  }

  get createdAtValue(): Date {
    return this.createdAt
  }

  get updatedAtValue(): Date {
    return this.updatedAt
  }

  get deletedAtValue(): Date | undefined {
    return this.deletedAt
  }
 get internalIdValue(): number {
  if (!this.internalId) {
    throw new Error('User is not persisted yet. Internal ID not assigned.')
  }
  return this.internalId
}
  // ---------------- FACTORY ----------------
  static create(uuid: string, name: string): Category {
    const now = new Date()
    return new Category(uuid, name, now, now)
  }
rename(newName: string): void {
  if (!newName || newName.trim().length === 0) {
    throw new Error("Category name cannot be empty")
  }

  this.name = newName
  this.updatedAt = new Date()
}

  // ----------------- SOFT DELETE -----------------
  delete() {
    if (!this.deletedAt) {
      this.deletedAt = new Date()
      this.updatedAt = new Date()
    }
  }

  restore() {
    if (this.deletedAt) {
      this.deletedAt = undefined
      this.updatedAt = new Date()
    }
  }

  isDeleted(): boolean {
    return !!this.deletedAt
  }
}
