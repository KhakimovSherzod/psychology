import { UserStatus } from '@/shared/enums/UserStatus.enum'

export class UserStatusVO {
  private _status: UserStatus

  constructor(status: UserStatus) {
    this._status = status
  }

  get value(): UserStatus {
    return this._status
  }

  set value(status: UserStatus) {
    this._status = status
  }
  get isVerified(): boolean {
    return this._status !== UserStatus.PENDING
  }
  get isActive(): boolean {
    return this._status === UserStatus.ACTIVE
  }

  get isDeleted(): boolean {
    return this._status === UserStatus.DELETED
  }
}
