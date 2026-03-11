import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { UserNotFound } from '@/shared/errors/repository/UserNotFound.error'
import { User } from '../../domain/entities/user.entity'
import type { GetAllUsersResponseDTO } from '../dto/get-all-users-response.dto'
import { toUserDTO, toUserDTOs } from '../mappers/user.mapper'
import type { IUserRepository } from '../repositories/user.repository'

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserByUUID(uuid: string): Promise<GetAllUsersResponseDTO> {
    const user = await this.userRepository.findByUUID(uuid)
    return toUserDTO(user)
  }

  // Delete user (soft delete)
  async deleteUser(uuid: string): Promise<void> {
    const user = await this.userRepository.findByUUID(uuid)

    user.softDelete()
    await this.userRepository.save(user)
  }
  //Admins restore deleted user account
  async restoreUser(uuid: string): Promise<void> {
    const user = await this.userRepository.findByUUID(uuid)
    if (!user) throw new UserNotFound('Foydalanuvchi topilmadi', uuid)
    user.restoreUser()
    await this.userRepository.save(user)
  }

  // Admin: Get all users
  async getAllUsers(includeDeleted: boolean): Promise<GetAllUsersResponseDTO[]> {
    const users = await this.userRepository.findAll(includeDeleted)
    return toUserDTOs(users)
  }

  // Find user by phone or device ID
  async findUserByPhoneOrDeviceId(deviceId: string, phone?: string): Promise<User | null> {
    return await this.userRepository.findByPhoneOrDeviceId(deviceId, phone)
  }

  // Get users by role
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.findByRole(role)
  }

  // Get users by status
  async getUsersByStatus(status: UserStatus): Promise<User[]> {
    return await this.userRepository.findByStatus(status)
  }

  // Get user count
  async getUserCount(includeDeleted: boolean = false): Promise<number> {
    return await this.userRepository.count(includeDeleted)
  }
}
