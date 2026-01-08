// src/modules/user/application/repositories/user.repository.ts

import type { User } from '@/modules/user/domain/entities/user.entity'
import type { UserRole } from '@/shared/enums/UserRole.enum'
import type { UserStatus } from '@/shared/enums/UserStatus.enum'

export interface IUserRepository {
  // Find methods
  findByPhone(phone: string): Promise<User | null>
  findByUUID(uuid: string): Promise<User>
  findByPhoneOrDeviceId(deviceId: string, phone?: string): Promise<User>

  // CRUD operations
  create(user: User): Promise<User>
  save(user: User): Promise<User>
  delete(uuid: string): Promise<void>

  // Business operations
  verifyPin(deviceId: string, pin: string): Promise<boolean>
  changePin(uuid: string, newPinHash: string): Promise<void>
  updateDeviceId(uuid: string, deviceId: string): Promise<User>
  updateLastLogin(uuid: string): Promise<void>

  // Query operations
  findAll(includeDeleted?: boolean): Promise<User[]>
  findByRole(role: UserRole): Promise<User[]>
  findByStatus(status: UserStatus): Promise<User[]>
  count(includeDeleted?: boolean): Promise<number>

  // Existence checks
  existsByPhone(phone: string): Promise<boolean>
  existsByUuid(uuid: string): Promise<boolean>
}
