// src/modules/user/infrastructure/prisma/repositories/prisma-user.repository.ts

import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import { User } from '@/modules/user/domain/entities/user.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/PhoneNumber'
import { UserName } from '@/modules/user/domain/value-objects/UserName'
import { UserStatusVO } from '@/modules/user/domain/value-objects/UserStatusVO'
import { prisma } from '@/shared/client'
import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { DatabaseError } from '@/shared/errors/DatabaseError'
import { UserMappingError } from '@/shared/errors/UserMappingError'
import { UserNotFound } from '@/shared/errors/UserNotFound.error'
import { logger } from '@/utils/logger'
import type { Prisma, Role, Status } from '@prisma/client'
import bcrypt from 'bcrypt'

export class PrismaUserRepository implements IUserRepository {
  // Helper: Convert Prisma Role to UserRole
  private toUserRole(role: Role): UserRole {
    return role as UserRole
  }

  // Helper: Convert UserRole to Prisma Role
  private toPrismaRole(role: UserRole): Role {
    return role as Role
  }

  // Helper: Convert Prisma Status to UserStatus
  private toUserStatus(status: Status): UserStatus {
    return status as UserStatus
  }

  // Helper: Convert UserStatus to Prisma Status
  private toPrismaStatus(status: UserStatus): Status {
    return status as Status
  }

  // Helper: Convert Prisma record to User entity
  private toDomain(record: any): User {
    return new User(
      record.uuid,
      new UserName(record.name),
      this.toUserRole(record.role),
      new UserStatusVO(this.toUserStatus(record.status)),
      new PhoneNumber(record.phone),
      record.pinHash,
      record.deviceId || [],
      record.profileImage || undefined,
      record.createdAt,
      record.lastLogin || undefined,
      record.deletedAt || undefined
    )
  }

  // Find a user by phone (non-deleted only)
  async findByPhone(phone: string): Promise<User | null> {
    const record = await prisma.user.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
    })

    if (!record) return null

    return this.toDomain(record)
  }

  // Find a user by UUID (non-deleted only)
  async findByUUID(uuid: string): Promise<User> {
    const record = await prisma.user.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    })

    if (!record) {
      logger.error(`User with UUID ${uuid} not found`)
      throw new UserNotFound('User with UUID not found', uuid)
    }

    try {
      return this.toDomain(record)
    } catch (error) {
      logger.error('Error mapping user by UUID in findByUUID in user prisma repository:', error)
      throw new UserMappingError(
        error instanceof Error
          ? error.message
          : 'UUID backend da mapping qilishida xatolik yuz berdi. '
      )
    }
  }

  // Create a new user
  async create(user: User): Promise<User> {
    // Prepare data with explicit handling of optional fields
    const data: Prisma.UserCreateInput = {
      uuid: user.uuid,
      name: user.name,
      role: this.toPrismaRole(user.role),
      status: this.toPrismaStatus(user.status),
      phone: user.phone,
      pinHash: user.pinHash,
      deviceId: user.deviceIds,
      createdAt: user.createdAt,
    }

    // Add optional fields only if they have values
    if (user.profileImage !== undefined) {
      data.profileImage = user.profileImage
    }

    if (user.lastLogin !== undefined) {
      data.lastLogin = user.lastLogin
    }

    if (user.deletedAt !== undefined) {
      data.deletedAt = user.deletedAt
    }

    const record = await prisma.user.create({
      data,
    })

    return this.toDomain(record)
  }

  // Save (update) a user
  async save(user: User): Promise<User> {
    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      name: user.name,
      role: this.toPrismaRole(user.role),
      status: this.toPrismaStatus(user.status),
      phone: user.phone,
      pinHash: user.pinHash,
      deviceId: user.deviceIds,
    }

    // Handle optional fields
    if (user.profileImage !== undefined) {
      updateData.profileImage = user.profileImage
    } else {
      updateData.profileImage = null // Explicitly set to null if undefined
    }

    if (user.lastLogin !== undefined) {
      updateData.lastLogin = user.lastLogin
    }

    if (user.deletedAt !== undefined) {
      updateData.deletedAt = user.deletedAt
    } else {
      updateData.deletedAt = null
    }

    const record = await prisma.user.update({
      where: { uuid: user.uuid },
      data: updateData,
    })

    return this.toDomain(record)
  }

  // Delete user (soft delete)
  async delete(uuid: string): Promise<void> {
    await prisma.user.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        status: this.toPrismaStatus(UserStatus.DELETED),
      },
    })
  }

  // Verify PIN (for non-deleted users)
  async verifyPin(deviceId: string, pin: string): Promise<boolean> {
    const record = await prisma.user.findFirst({
      where: {
        deviceId: { has: deviceId },
        deletedAt: null,
      },
    })

    if (!record) return false

    return bcrypt.compare(pin, record.pinHash)
  }

  // Change PIN
  async changePin(uuid: string, newPinHash: string): Promise<void> {
    await prisma.user.update({
      where: { uuid },
      data: {
        pinHash: newPinHash,
      },
    })
  }

  // Update device ID (for non-deleted users)
  async updateDeviceId(uuid: string, deviceId: string): Promise<User> {
    // Get current user
    const record = await prisma.user.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
    })

    if (!record) {
      throw new Error('User not found')
    }

    const deviceIds = record.deviceId || []
    if (!deviceIds.includes(deviceId)) {
      deviceIds.push(deviceId)
    }

    const updateData: Prisma.UserUpdateInput = {
      deviceId: deviceIds,
    }

    const updated = await prisma.user.update({
      where: { uuid },
      data: updateData,
    })

    return this.toDomain(updated)
  }

  // Update last login
  async updateLastLogin(uuid: string): Promise<void> {
    await prisma.user.update({
      where: { uuid },
      data: {
        lastLogin: new Date(),
      },
    })
  }

  // Find by phone or device ID (non-deleted only)
  async findByPhoneOrDeviceId(deviceId: string, phone?: string): Promise<User> {
    const orConditions: Prisma.UserWhereInput[] = []
    if (phone) {
      console.log('Searching for user with phone:', phone)
      orConditions.push({ phone })
    }

    if (deviceId) {
      orConditions.push({ deviceId: { has: deviceId } })
    }

    const record = await prisma.user.findFirst({
      where: {
        OR: orConditions,
        deletedAt: null,
      },
    })

    if (!record)
      throw new UserNotFound(`User not found with given phone:${phone} or device ID:${deviceId}`)

    return this.toDomain(record)
  }

  // Get all users (optionally include deleted)
  async findAll(includeDeleted: boolean = false): Promise<User[]> {
    const where = includeDeleted ? {} : { deletedAt: null }

    let records
    try {
      records = await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } })
    } catch (err) {
      throw new DatabaseError(err instanceof Error ? err.message : String(err))
    }

    if (!records || records.length === 0) {
      return []
    }

    try {
      return records.map(record => this.toDomain(record))
    } catch (err) {
      throw new UserMappingError(err instanceof Error ? err.message : String(err))
    }
  }

  // Find users by role (non-deleted only)
  async findByRole(role: UserRole): Promise<User[]> {
    const records = await prisma.user.findMany({
      where: {
        role: this.toPrismaRole(role),
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return records.map(record => this.toDomain(record))
  }

  // Find users by status (non-deleted only)
  async findByStatus(status: UserStatus): Promise<User[]> {
    const records = await prisma.user.findMany({
      where: {
        status: this.toPrismaStatus(status),
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return records.map(record => this.toDomain(record))
  }

  // Count users (optionally include deleted)
  async count(includeDeleted: boolean = false): Promise<number> {
    const where: Prisma.UserWhereInput = includeDeleted ? {} : { deletedAt: null }

    return await prisma.user.count({ where })
  }

  // Check if phone exists (non-deleted only)
  async existsByPhone(phone: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        phone,
        deletedAt: null,
      },
    })

    return count > 0
  }

  // Check if UUID exists (non-deleted only)
  async existsByUuid(uuid: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        uuid,
        deletedAt: null,
      },
    })

    return count > 0
  }

  // Additional method for compatibility with old interface
  async updateUser(
    uuid: string,
    name?: string,
    phone?: string,
    pin?: string,
    profileImage?: string
  ): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {}

    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (pin !== undefined) {
      const pinHash = await bcrypt.hash(pin, 10)
      updateData.pinHash = pinHash
    }
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage
    }

    const record = await prisma.user.update({
      where: { uuid },
      data: updateData,
    })

    return this.toDomain(record)
  }

  // Additional method for compatibility
  async deleteUser(uuid: string): Promise<void> {
    await this.delete(uuid)
  }

  // Helper method to find user by phone including deleted (for admin purposes)
  async findByPhoneIncludingDeleted(phone: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { phone },
    })

    if (!record) return null

    return this.toDomain(record)
  }

  // Helper method to find user by UUID including deleted (for admin purposes)
  async findByUUIDIncludingDeleted(uuid: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { uuid },
    })

    if (!record) return null

    return this.toDomain(record)
  }

  // Restore soft-deleted user
  async restore(uuid: string): Promise<User> {
    const record = await prisma.user.update({
      where: { uuid },
      data: {
        deletedAt: null,
        status: this.toPrismaStatus(UserStatus.ACTIVE),
      },
    })

    return this.toDomain(record)
  }

  // Permanently delete user (hard delete)
  async permanentDelete(uuid: string): Promise<void> {
    await prisma.user.delete({
      where: { uuid },
    })
  }
}
