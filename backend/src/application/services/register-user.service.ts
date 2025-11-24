import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { User } from '../../domain/entities/user.entity'
import type { IUserRepository } from '../../domain/repositories/user.repository'
import type { RegisterUserDTO } from '../dto/register-user.dto'

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO) {
    // 1️⃣ Check if user exists
    const existing = await this.userRepository.findByPhone(data.phone)
    if (existing) throw new Error('Phone already registered')

 
    const hashedPin = await bcrypt.hash(data.pin, 10)

    const user = new User(
      crypto.randomUUID(), // uuid
      data.name, // name
      data.phone, // phone
      hashedPin, // hashed pin
      [data.deviceId] // deviceId array
    )
    const createdUser = await this.userRepository.create(user)

    return {
      createdUser
    }
  }

 
}
