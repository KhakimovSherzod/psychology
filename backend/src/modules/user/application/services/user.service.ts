// src/modules/user/application/services/user.service.ts

import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import bcrypt from 'bcrypt'
import { User } from '../../domain/entities/user.entity'
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber'
import { UserName } from '../../domain/value-objects/UserName'
import { UserStatusVO } from '../../domain/value-objects/UserStatusVO'
import type { GetAllUsersResponseDTO } from '../dto/get-all-users-response.dto'
import { toUserDTO, toUserDTOs } from '../mappers/user.mapper'
import type { IUserRepository } from '../repositories/user.repository'

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  // Get user by UUID
  async getUserByUUID(uuid: string): Promise<GetAllUsersResponseDTO> {
    console.log('Fetching user with UUID:', uuid)
    const user = await this.userRepository.findByUUID(uuid)
    return toUserDTO(user)
  }

  // Create a new user
  async createUser(
    name: string,
    phone: string,
    pin: string,
    deviceId?: string,
    role: UserRole = UserRole.USER
    //TODO update get allusers response dto to create user or modify mapping to make unified map
  ): Promise<GetAllUsersResponseDTO> {
    try {
      // Create value objects
      const userName = new UserName(name)
      const phoneNumber = new PhoneNumber(phone)
      const status = new UserStatusVO(UserStatus.ACTIVE) // Default to ACTIVE

      // Hash PIN
      const pinHash = await bcrypt.hash(pin, 10)

      // Generate UUID
      const uuid = crypto.randomUUID()

      // Create user entity
      const newUser = new User(
        uuid,
        userName,
        role,
        status,
        phoneNumber,
        pinHash,
        deviceId ? [deviceId] : [],
        undefined, // profileImage
        new Date(),
        undefined, // lastLogin
        undefined // deletedAt
      )

      const user = await this.userRepository.create(newUser)

      return toUserDTO(user)
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Update user details
  async updateUser(
    uuid: string,
    updates: {
      name?: string
      phone?: string
      pin?: string
      profileImage?: string
      role?: UserRole
      status?: UserStatus
    }
  ): Promise<User> {
    // Get existing user
    const user = await this.userRepository.findByUUID(uuid)
    if (!user) {
      throw new Error('User not found')
    }

    try {
      // Apply updates
      if (updates.name !== undefined) {
        user.updateName(new UserName(updates.name))
      }

      if (updates.phone !== undefined) {
        user.updatePhone(new PhoneNumber(updates.phone))
      }

      if (updates.pin !== undefined) {
        const pinHash = await bcrypt.hash(updates.pin, 10)
        user.updatePinHash(pinHash)
      }

      if (updates.profileImage !== undefined) {
        user.updateProfileImage(updates.profileImage)
      }

      if (updates.role !== undefined) {
        user.setRole(updates.role)
      }

      if (updates.status !== undefined) {
        user.setStatus(new UserStatusVO(updates.status))
      }

      // Save updated user
      return await this.userRepository.save(user)
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  // Delete user (soft delete)
  async deleteUser(uuid: string): Promise<void> {
    const user = await this.userRepository.findByUUID(uuid)
    user.softDelete()
    await this.userRepository.save(user)
  }

  // Admin: Get all users
  async getAllUsers(includeDeleted: boolean = false): Promise<GetAllUsersResponseDTO[]> {
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

  // Update user status
  async updateUserStatus(uuid: string, status: UserStatus): Promise<User> {
    return await this.updateUser(uuid, { status })
  }

  // Update user role
  async updateUserRole(uuid: string, role: UserRole): Promise<User> {
    return await this.updateUser(uuid, { role })
  }

  // Add device to user
  async addDevice(uuid: string, deviceId: string): Promise<User> {
    return await this.userRepository.updateDeviceId(uuid, deviceId)
  }

  // Get user count
  async getUserCount(includeDeleted: boolean = false): Promise<number> {
    return await this.userRepository.count(includeDeleted)
  }

  // Check if user exists
  async userExists(phone: string): Promise<boolean> {
    return await this.userRepository.existsByPhone(phone)
  }

  // Activate user
  async activateUser(uuid: string): Promise<User> {
    return await this.updateUser(uuid, { status: UserStatus.ACTIVE })
  }

  // Deactivate user
  async deactivateUser(uuid: string): Promise<User> {
    return await this.updateUser(uuid, { status: UserStatus.INACTIVE })
  }

  // Suspend user
  async suspendUser(uuid: string): Promise<User> {
    return await this.updateUser(uuid, { status: UserStatus.SUSPENDED })
  }
}
