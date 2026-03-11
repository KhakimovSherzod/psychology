// src/modules/user/infrastructure/prisma/repositories/prisma-user.repository.ts

import type { IUserRepository } from '@/modules/user/application/repositories/user.repository'
import { Device } from '@/modules/user/domain/entities/device.entity'
import { User } from '@/modules/user/domain/entities/user.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/PhoneNumber'
import { UserName } from '@/modules/user/domain/value-objects/UserName'
import { UserStatusVO } from '@/modules/user/domain/value-objects/UserStatusVO'
import { prisma } from '@/shared/client'
import { UserRole } from '@/shared/enums/UserRole.enum'
import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { DatabaseError } from '@/shared/errors/repository/DatabaseError'
import { UserMappingError } from '@/shared/errors/repository/UserMappingError'
import { UserNotFound } from '@/shared/errors/repository/UserNotFound.error'
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

  // Helper: Convert UserStatus to Prisma Status
  private toPrismaStatus(status: UserStatus): Status {
    return status as Status
  }

  // Helper: Convert Prisma record to User entity
private toDomain(record: any): User {
  const devices: Device[] = (record.devices ?? []).map((d: any) =>
    Device.reconstruct(
      d.uuid,
      record.uuid,
      d.deviceName,
      d.deviceType,
      d.os,
      d.browser,
      d.ipAddress,
      d.deviceToken,
      d.lastUsedAt,
      d.createdAt,
      d.deletedAt ?? undefined,
      d.id // 👈 internalId from DB
    )
  )

  return User.reconstruct({
    uuid: record.uuid,
    name: new UserName(record.name),
    role: this.toUserRole(record.role),
    status: new UserStatusVO(record.status),
    phone: new PhoneNumber(record.phone),
    pinHash: record.pinHash,
    devices,
    profileImage: record.profileImage,
    createdAt: record.createdAt,
    lastLogin: record.lastLogin,
    deletedAt: record.deletedAt,
    internalId: record.id // 👈 VERY IMPORTANT
  })
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
      },
    })

    if (!record) {
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
  async create(user: User): Promise<User> {
    const record = await prisma.user.create({
      data: {
        uuid: user.id,
        name: user.nameValue,
        phone: user.phoneValue,
        pinHash: user.pinHashValue,
        role: user.roleValue,
        status: user.statusValue,
        profileImage: user.profileImageValue,
        createdAt: user.createdAtValue,
        lastLogin: user.lastLoginValue,
        deletedAt: user.deletedAtValue,
      },
    })

    return this.toDomain(record)
  }

  // Save (update) a user

async save(user: User): Promise<User> {
  const record = await prisma.$transaction(async tx => {
    // 1️⃣ Upsert user
    const userRecord = await tx.user.upsert({
      where: { uuid: user.id },
      update: {
        name: user.nameValue,
        phone: user.phoneValue,
        pinHash: user.pinHashValue,
        status: user.statusValue,
        role: user.roleValue,
        ...(user.profileImageValue !== undefined && { profileImage: user.profileImageValue }),
        ...(user.lastLoginValue !== undefined && { lastLogin: user.lastLoginValue }),
        ...(user.deletedAtValue !== undefined && { deletedAt: user.deletedAtValue }),
      },
      create: {
        uuid: user.id,
        name: user.nameValue,
        phone: user.phoneValue,
        pinHash: user.pinHashValue,
        status: user.statusValue,
        role: user.roleValue,
        profileImage: user.profileImageValue ?? null,
        createdAt: user.createdAtValue,
        lastLogin: user.lastLoginValue ?? null,
        deletedAt: user.deletedAtValue ?? null,
      },
    })

    // 2️⃣ Resolve internal numeric ID for devices
    const userIdInt = userRecord.id

    // 3️⃣ Upsert devices
    for (const device of user.getDevices()) {
      await tx.device.upsert({
        where: { uuid: device.uuidValue },
        update: {
          ...(device.deviceNameValue !== undefined && { deviceName: device.deviceNameValue }),
          ...(device.deviceTypeValue !== undefined && { deviceType: device.deviceTypeValue }),
          ...(device.osValue !== undefined && { os: device.osValue }),
          ...(device.browserValue !== undefined && { browser: device.browserValue }),
          ...(device.ipAddressValue !== undefined && { ipAddress: device.ipAddressValue }),
          ...(device.deviceTokenValue !== undefined && { deviceToken: device.deviceTokenValue }),
          lastUsedAt: device.lastUsedAtValue,
          ...(device.deletedAtValue !== undefined && { deletedAt: device.deletedAtValue ?? null }),
          userId: userIdInt, // <-- map UUID to internal Int ID here
        },
        create: {
          uuid: device.uuidValue,
          userId: userIdInt, // <-- map UUID to internal Int ID here
          ...(device.deviceNameValue !== undefined && { deviceName: device.deviceNameValue }),
          ...(device.deviceTypeValue !== undefined && { deviceType: device.deviceTypeValue }),
          ...(device.osValue !== undefined && { os: device.osValue }),
          ...(device.browserValue !== undefined && { browser: device.browserValue }),
          ...(device.ipAddressValue !== undefined && { ipAddress: device.ipAddressValue }),
          ...(device.deviceTokenValue !== undefined && { deviceToken: device.deviceTokenValue }),
          lastUsedAt: device.lastUsedAtValue,
          createdAt: device.createdAtValue,
          ...(device.deletedAtValue !== undefined && { deletedAt: device.deletedAtValue ?? null }),
        },
      })
    }

    return userRecord
  })

  return this.toDomain(record)
}

  // Delete user (soft delete)
  async delete(uuid: string): Promise<void> {
    await prisma.user.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  // Find by phone or device ID (non-deleted only)
  async findByPhoneOrDeviceId(deviceId?: string, phone?: string): Promise<User> {
    if (!deviceId && !phone) {
      throw new Error('Must provide phone or deviceId')
    }

    const whereConditions: any = {
      deletedAt: null,
    }

    if (phone && deviceId) {
      whereConditions.OR = [
        { phone },
        {
          devices: {
            some: {
              uuid: deviceId,
              deletedAt: null,
            },
          },
        },
      ]
    } else if (phone) {
      whereConditions.phone = phone
    } else if (deviceId) {
      whereConditions.devices = {
        some: {
          uuid: deviceId,
          deletedAt: null,
        },
      }
    }

    const record = await prisma.user.findFirst({
      where: whereConditions,
      include: {
        devices: true,
      },
    })

    if (!record) {
      throw new UserNotFound(
        `User not found with phone: ${phone ?? 'N/A'} or deviceId: ${deviceId ?? 'N/A'}`
      )
    }

    return this.toDomain(record)
  }

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
    const where: Prisma.userWhereInput = includeDeleted ? {} : { deletedAt: null }

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
    const updateData: Prisma.userUpdateInput = {}

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
}
