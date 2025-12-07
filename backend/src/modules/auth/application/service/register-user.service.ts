import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import { User } from '@/modules/user/domain/entities/user.entity'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type { RegisterUserDTO } from '../dto/register-user.dto'

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO) {
    const existing = await this.userRepository.findByPhone(data.phone)
    if (existing) throw new Error('Phone already registered')

    const hashedPin = await bcrypt.hash(data.pin, 10)

    const user = new User(crypto.randomUUID(), data.name, data.phone, hashedPin, [data.deviceId])
    const createdUser = await this.userRepository.create(user)

    return {
      createdUser,
    }
  }
}
