import { UserStatus } from '@/shared/enums/UserStatus.enum'

export class UserStatusVO {
  constructor(private status: UserStatus) {
    this.status = status
  }

  get value(): UserStatus {
    return this.status
  }

  set value(status: UserStatus) {
    this.status = status
  }
  get isVerified(): boolean {
    return this.status !== UserStatus.PENDING
  }
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE
  }
}
