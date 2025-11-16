import bcrypt from 'bcrypt'
import type { IUserRepository } from '../../domain/repositories/user.repository'

export class LoginUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(phone: string, pin: string) {
    const user = await this.userRepository.findByPhone(phone)
    if (!user) throw new Error('Invalid credentials')

    const valid = await bcrypt.compare(pin, user.pin)
    if (!valid) throw new Error('Invalid credentials')

    return user
  }
}
