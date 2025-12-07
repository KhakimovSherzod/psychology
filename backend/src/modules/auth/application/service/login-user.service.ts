import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import bcrypt from 'bcrypt'

export class LoginUserService {
  constructor(private userRepository: IUserRepository) {}

  async login(deviceId: string, pin: string, phone?: string) {
    const user = await this.userRepository.findByPhoneOrDeviceId(deviceId, phone)

    if (!user || user === null) {
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
