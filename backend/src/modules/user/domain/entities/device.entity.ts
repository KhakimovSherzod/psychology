export class Device {
  private constructor(
    private readonly uuid: string,
    private readonly userId: string,
    private readonly deviceName?: string,
    private readonly deviceType?: string,
    private readonly os?: string,
    private readonly browser?: string,
    private readonly ipAddress?: string,
    private readonly deviceToken?: string,
    private lastUsedAt: Date = new Date(),
    private readonly createdAt: Date = new Date(),
    private deletedAt?: Date,
    private internalId?: number
  ) {}

  static create(
    uuid: string,
    userId: string,
    deviceName?: string,
    deviceType?: string,
    os?: string,
    browser?: string,
    ipAddress?: string,
    deviceToken?: string
  ): Device {
    return new Device(
      uuid,
      userId,
      deviceName,
      deviceType,
      os,
      browser,
      ipAddress,
      deviceToken
    )
  }

  static reconstruct(
    uuid: string,
    userId: string,
    deviceName?: string,
    deviceType?: string,
    os?: string,
    browser?: string,
    ipAddress?: string,
    deviceToken?: string,
    lastUsedAt?: Date,
    createdAt?: Date,
    deletedAt?: Date,
    internalId?: number
  ): Device {
    return new Device(
      uuid,
      userId,
      deviceName,
      deviceType,
      os,
      browser,
      ipAddress,
      deviceToken,
      lastUsedAt ?? new Date(),
      createdAt ?? new Date(),
      deletedAt,
      internalId
    )
  }

  // ===== Behavior =====

  markUsed() { this.lastUsedAt = new Date() }
  softDelete() { this.deletedAt = new Date() }
  restore() { this.deletedAt = undefined }
  isDeleted(): boolean { return !!this.deletedAt }

  // ===== Internal ID Handling =====

  assignInternalId(id: number) {
    if (this.internalId) {
      throw new Error('Internal ID already assigned')
    }
    this.internalId = id
  }

  // ===== Getters =====

  get uuidValue(): string { return this.uuid }
  get userIdValue(): string { return this.userId }
  get deviceNameValue(): string | undefined { return this.deviceName }
  get deviceTypeValue(): string | undefined { return this.deviceType }
  get osValue(): string | undefined { return this.os }
  get browserValue(): string | undefined { return this.browser }
  get ipAddressValue(): string | undefined { return this.ipAddress }
  get deviceTokenValue(): string | undefined { return this.deviceToken }
  get lastUsedAtValue(): Date { return this.lastUsedAt }
  get createdAtValue(): Date { return this.createdAt }
  get deletedAtValue(): Date | undefined { return this.deletedAt }

  get internalIdValue(): number {
    if (!this.internalId) {
      throw new Error('Device is not persisted yet. Internal ID not assigned.')
    }
    return this.internalId
  }
}
