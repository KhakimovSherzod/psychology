import type { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../repositories/user.repository'
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

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll()
  }
}
