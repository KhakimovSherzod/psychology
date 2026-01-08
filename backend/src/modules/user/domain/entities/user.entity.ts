import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { PhoneNumber } from '../value-objects/PhoneNumber'
import { UserName } from '../value-objects/UserName'
import { UserStatusVO } from '../value-objects/UserStatusVO'

export class User {
  private readonly _uuid: string
  private _name: UserName
  private _role: UserRole
  private _status: UserStatusVO
  private _phone: PhoneNumber
  private _pinHash: string
  private _profileImage: string | undefined
  private _deviceIds: string[]
  private readonly _createdAt: Date
  private _lastLogin: Date | undefined
  private _deletedAt: Date | undefined

  constructor(
    uuid: string,
    name: UserName,
    role: UserRole,
    status: UserStatusVO,
    phone: PhoneNumber,
    pinHash: string,
    deviceIds: string[] = [],
    profileImage?: string,
    createdAt: Date = new Date(),
    lastLogin?: Date,
    deletedAt?: Date
  ) {
    this._uuid = uuid
    this._name = name
    this._role = role
    this._status = status
    this._phone = phone
    this._pinHash = pinHash
    this._deviceIds = deviceIds
    this._profileImage = profileImage
    this._createdAt = createdAt
    this._lastLogin = lastLogin
    this._deletedAt = deletedAt
  }

  // ===== Getters =====

  get uuid(): string {
    return this._uuid
  }
  get name(): string {
    return this._name.value
  }
  get role(): UserRole {
    return this._role
  }
  get status(): UserStatus {
    return this._status.value
  }
  get phone(): string {
    return this._phone.value
  }
  get pinHash(): string {
    return this._pinHash
  }
  get profileImage(): string | undefined {
    return this._profileImage
  }
  get deviceIds(): string[] {
    return [...this._deviceIds]
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get lastLogin(): Date | undefined {
    return this._lastLogin
  }
  get deletedAt(): Date | undefined {
    return this._deletedAt
  }

  get isActive(): boolean {
    return this._status.isActive
  }
  get isDeleted(): boolean {
    return this._status.isDeleted || !!this._deletedAt
  }

  updateName(name: UserName) {
    this._name = name
  }
  setRole(role: UserRole) {
    this._role = role
  }
  setStatus(status: UserStatusVO) {
    if (this.isDeleted) throw new Error('Cannot change status of deleted user')
    this._status = status
  }
  updatePhone(phone: PhoneNumber) {
    this._phone = phone
  }
  updatePinHash(hash: string) {
    this._pinHash = hash
  }
  updateProfileImage(url: string) {
    this._profileImage = url
  }
  addDevice(deviceId: string) {
    if (!this._deviceIds.includes(deviceId)) this._deviceIds.push(deviceId)
  }
  removeDevice(deviceId: string) {
    this._deviceIds = this._deviceIds.filter(d => d !== deviceId)
  }
  updateLastLogin(date: Date = new Date()) {
    this._lastLogin = date
  }
  softDelete() {
    this._deletedAt = new Date()
    this._status = new UserStatusVO(UserStatus.DELETED)
  }
}
