import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { PhoneNumber } from '../value-objects/PhoneNumber'
import { UserName } from '../value-objects/UserName'
import { UserStatusVO } from '../value-objects/UserStatusVO'
import { Device } from './device.entity'

export class User {
  private devices: Device[] = []

  private constructor(
    private readonly uuid: string,
    private name: UserName,
    private role: UserRole,
    private status: UserStatusVO,
    private phone: PhoneNumber,
    private pinHash: string,
    private internalId?:number,
    devices?: Device[], // Devices are optional now
    private profileImage: string | null = null, // profileImage is nullable
    private readonly createdAt: Date = new Date(),
    private lastLogin: Date | null = null, // lastLogin can be null
    private deletedAt: Date | null = null  // deletedAt can be null
    
  ) {
    if (devices) this.devices = devices
  }

  // ===== Factory =====
  static create(
    uuid: string,
    name: UserName,
    phone: PhoneNumber,
    pinHash: string,
  ): User {
    return new User(
      uuid,
      name,
      UserRole.USER,
      new UserStatusVO(UserStatus.ACTIVE),
      phone,
      pinHash
    )
  }

  static reconstruct(
    params:{
      uuid: string,
      name: UserName,
      role: UserRole,
      status: UserStatusVO,
      phone: PhoneNumber,
      pinHash: string,
      devices?: Device[], // Devices can be undefined
      profileImage: string | null, // Profile image can be null
      createdAt: Date, // Optional createdAt
      lastLogin: Date | null, // Optional lastLogin
      deletedAt: Date | null // Optional deletedAt
      internalId?:number,
    }
  ): User {
    return new User(
      params.uuid,
      params.name,
      params.role,
      params.status,
      params.phone,
      params.pinHash,
      params.internalId,
      params.devices,
      params.profileImage,
      params.createdAt,
      params.lastLogin,
      params.deletedAt
    )
  }

  // ===== Device Management =====

  // Add a device
  addDevice(device: Device) {
    const exists = this.devices.find(d => d.uuidValue === device.uuidValue)
    if (exists) throw new Error('Device already registered')
    this.devices.push(device)
  }

  // Mark device as used
  markDeviceUsed(deviceUuid: string) {
    const device = this.devices.find(d => d.uuidValue === deviceUuid)
    if (!device) throw new Error('Device not found')
    device.markUsed()
  }

  // Soft delete a device
  removeDevice(deviceUuid: string) {
    const device = this.devices.find(d => d.uuidValue === deviceUuid)
    if (!device) throw new Error('Device not found')
    device.softDelete()
  }

  // Get all active devices
  getActiveDevices(): Device[] {
    return this.devices.filter(d => !d.isDeleted())
  }

  // ===== Getters =====
  get id(): string { return this.uuid }
  get nameValue(): string { return this.name.value }
  get roleValue(): UserRole { return this.role }
  get statusValue(): UserStatus { return this.status.value }
  get phoneValue(): string { return this.phone.value }
  get pinHashValue(): string { return this.pinHash }
 get internalIdValue(): number {
  if (!this.internalId) {
    throw new Error('User is not persisted yet. Internal ID not assigned.')
  }
  return this.internalId
}

  get profileImageValue(): string | null { return this.profileImage }
  get createdAtValue(): Date { return this.createdAt }
  get lastLoginValue(): Date | null { return this.lastLogin }
  get deletedAtValue(): Date | null { return this.deletedAt }
  getDevices(): readonly Device[] { return this.devices }

  // ===== Derived state =====
  get isActive(): boolean { return this.status.isActive }
  get isDeleted(): boolean { return !!this.deletedAt }

  // ===== Behavior =====
  updateName(name: UserName) { this.name = name }
  setRole(role: UserRole) { this.role = role }
  setStatus(status: UserStatusVO) {
    if (this.isDeleted) throw new Error('Cannot change status of deleted user')
    this.status = status
  }
  updatePhone(phone: PhoneNumber) { this.phone = phone }
  changePinHash(hash: string) { this.pinHash = hash }
  updateProfileImage(url: string | null) { this.profileImage = url } // Update with null or string
  updateLastLogin(date: Date = new Date()) { this.lastLogin = date }
  softDelete() { this.deletedAt = new Date() }
  restoreUser() { if (this.isDeleted) this.deletedAt = null }
}
