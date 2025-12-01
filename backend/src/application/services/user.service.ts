import bcrypt from 'bcrypt'
import type { IUserRepository } from '../../domain/repositories/user.repository'
export class UserService {
  constructor(private userRepository: IUserRepository) {}
  async getUserByUUID(uuid: string) {
    return await this.userRepository.findByUUID(uuid)
  }

  // Update user details
  async updateUser(
    uuid: string,
    name?: string,
    phone?: string,
    pin?: string,
    profileImage?: string
  ): Promise<{ status: number; message: string }> {
    return await this.userRepository.updateUser(uuid, name, phone, pin, profileImage)
  }


  async deleteUser(uuid: string): Promise<{ status: string; message: string }> {
    return await this.userRepository.deleteUser(uuid)
  }
  async verifyPin(uuid: string, pin: string): Promise<boolean> {
    return await this.userRepository.verifyPin(uuid, pin)
  }

  async changePin(uuid: string, newPin: string): Promise<{ status: number; message: string }> {
    const hashedNewPin = await bcrypt.hash(newPin, 10)
    return await this.userRepository.changePin(uuid, hashedNewPin)
  }
}
