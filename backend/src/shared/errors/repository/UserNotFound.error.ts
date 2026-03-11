import { BaseRepositoryError } from './BaseRepositoryError'

export class UserNotFound extends BaseRepositoryError {
  readonly code = 'USER_NOT_FOUND'

  constructor(message: string = "Foydalanuvchi topilmadi", identifier?: string | undefined) {
    super(` ${identifier ? ` shu UUID foydalanuvchisi "${identifier}"  topilmadi` : message}`)
  }
}
