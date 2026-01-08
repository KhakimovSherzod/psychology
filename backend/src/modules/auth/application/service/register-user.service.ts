import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import { User } from '@/modules/user/domain/entities/user.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/PhoneNumber'
import { UserName } from '@/modules/user/domain/value-objects/UserName'
import { UserStatusVO } from '@/modules/user/domain/value-objects/UserStatusVO'
import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type { RegisterUserDTO } from '../dto/register-user.dto'

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO) {
    const existing = await this.userRepository.findByPhone(data.phone)
    if (existing) throw new Error('Phone already registered')

    const hashedPin = await bcrypt.hash(data.pin, 10)

    const user = new User(
      crypto.randomUUID(),
      new UserName(data.name),
      UserRole.USER,
      new UserStatusVO(UserStatus.ACTIVE),
      new PhoneNumber(data.phone),
      hashedPin,
      [data.deviceId]
    )
    const createdUser = await this.userRepository.create(user)

    return {
      createdUser,
    }
  }
}
