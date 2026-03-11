import { BaseApplicationError } from './BaseApplicationError'

export class UserAlreadyExist extends BaseApplicationError {
  readonly code = 'USER_ALREADY_EXIST'

  constructor(message?: string) {
    super(message ?? 'Foydalanuvchi mavjud')
  }
}
