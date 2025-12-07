import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import bcrypt from 'bcrypt'
export class PinService {
  constructor(private userRepository: IUserRepository) {}
  
  async verifyPin(uuid: string, pin: string): Promise<boolean> {
    return await this.userRepository.verifyPin(uuid, pin)
  }

  async changePin(uuid: string, newPin: string): Promise<{ status: number; message: string }> {
    const hashedNewPin = await bcrypt.hash(newPin, 10)
    return await this.userRepository.changePin(uuid, hashedNewPin)
  }
}
