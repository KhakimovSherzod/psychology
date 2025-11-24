import bcrypt from 'bcrypt'
import type { IUserRepository } from '../../domain/repositories/user.repository'

export class LoginUserService {
  constructor(private userRepository: IUserRepository) {}

  async login(deviceId: string,  pin: string, phone?: string) {
    const user = await this.userRepository.findByPhoneOrDeviceId(phone, deviceId)

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi')
    }
    // 🔥 FIX — compare plaintext PIN with stored hash
    const isPinValid = await bcrypt.compare(pin, user.pin)
    if (!isPinValid) {
      throw new Error("Noto'gri pin")
    }
    await this.userRepository.updateLastLogin(user.phone)

    await this.userRepository.updateDeviceId(user.phone, deviceId)
    return user
  }
}
