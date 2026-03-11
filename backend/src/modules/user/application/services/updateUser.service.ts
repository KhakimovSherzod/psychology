// src/modules/user/application/services/update-user.service.ts
import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import bcrypt from 'bcrypt'
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber'
import { UserName } from '../../domain/value-objects/UserName'
import { UserStatusVO } from '../../domain/value-objects/UserStatusVO'
import type { IUserRepository } from '../repositories/user.repository'

interface UpdateUserDTO {
  name?: string
  phone?: string
  pin?: string
  profileImage?: string
  role?: UserRole
  status?: UserStatus
}

export class UpdateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    uuid: string,
    updates: UpdateUserDTO
  ): Promise<void> {
    // Get existing user
    const user = await this.userRepository.findByUUID(uuid)

      if (updates.name !== undefined) {
        user.updateName(new UserName(updates.name))
      }

      if (updates.phone !== undefined) {
        user.updatePhone(new PhoneNumber(updates.phone))
      }

      if (updates.pin !== undefined) {
        const pinHash = await bcrypt.hash(updates.pin, 10)
        user.changePinHash(pinHash)
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


       await this.userRepository.save(user)

  
    }

      async updateUserStatus(uuid: string, status: UserStatus): Promise<void> {
         await this.execute(uuid, { status })
      }
    
      // Update user role
      async updateUserRole(uuid: string, role: UserRole): Promise<void> {
         await this.execute(uuid, { role })
      }

      
        // Activate user
  async activateUser(uuid: string): Promise<void> {
     await this.execute(uuid, { status: UserStatus.ACTIVE })
  }

  // Deactivate user
  async deactivateUser(uuid: string): Promise<void> {
     await this.execute(uuid, { status: UserStatus.INACTIVE })
  }

  // Suspend user
  async suspendUser(uuid: string): Promise<void> {
     await this.execute(uuid, { status: UserStatus.SUSPENDED })
  }
}