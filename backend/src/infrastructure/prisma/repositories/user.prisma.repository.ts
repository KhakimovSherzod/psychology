import type { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { User } from '../../../domain/entities/user.entity'
import type { IUserRepository } from '../../../domain/repositories/user.repository'
import { prisma } from '../client'

export class PrismaUserRepository implements IUserRepository {
  // Create a new user
  async create(user: User): Promise<User> {
    const record = await prisma.user.create({
      data: {
        uuid: user.uuid,
        name: user.name,
        phone: user.phone,
        pin: user.pin,
        deviceId: user.deviceId,
      },
    })

    return new User(
      record.uuid,
      record.name,
      record.phone,
      record.pin,
      record.deviceId,
      record.id,
      record.role,
      record.profileImage,
      record.createdAt,
      record.lastLogin
    )
  }

  // Find a user by phone
  async findByPhone(phone: string): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { phone },
    })

    if (!record) return null

    return new User(
      record.uuid,
      record.name,
      record.phone,
      record.pin,
      record.deviceId,
      record.id,
      record.role,
      record.profileImage,
      record.createdAt,
      record.lastLogin
    )
  }

  // Find a user by UUID and update their last login time
  async findByUUID(uuid: string): Promise<User | null> {
    const nowUtc = new Date()

    try {
      const record = await prisma.user.update({
        where: { uuid },
        data: {
          lastLogin: nowUtc,
        },
      })

      return new User(
        record.uuid,
        record.name,
        record.phone,
        record.pin,
        record.deviceId,
        record.id,
        record.role,
        record.profileImage,
        record.createdAt,
        record.lastLogin
      )
    } catch (err) {
      // UUID not found or other errors
      return null
    }
  }

  // Update user data based on the provided fields
  async updateUser(
    uuid: string,
    name?: string,
    phone?: string,
    pin?: string,
    profileImage?: string
  ): Promise<{ status: number; message: string }> {
    try {
      // Prepare the data to update, only including fields that are not undefined
      const dataToUpdate: Record<string, any> = {}

      if (name) dataToUpdate.name = name
      if (phone) dataToUpdate.phone = phone
      if (pin) dataToUpdate.pin = pin
      if (profileImage) dataToUpdate.profileImage = profileImage

      // Check if there's any data to update
      if (Object.keys(dataToUpdate).length === 0) {
        return { status: 400, message: 'Yangilash uchun maydonlar kiritilmadi.' }
      }

      // --- PHONE CHECK ---
      if (phone) {
        const existingUser = await prisma.user.findUnique({
          where: { phone },
        })

        if (existingUser) {
          // If phone exists for another user, return error
          return { status: 400, message: 'Bu telefon raqam allaqachon mavjud.' }
        }
      }

      // Perform the update operation
      await prisma.user.update({
        where: { uuid },
        data: dataToUpdate,
      })

      // Return success message
      return {
        status: 200,
        message: 'Foydalanuvchi muvaffaqiyatli yangilandi.',
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('User Prisma repository updateUser funksiyasida xato yuz berdi:', err)

        return {
          status: 500,
          message: `Foydalanuvchini yangilashda xato yuz berdi: ${err.message}`,
        }
      } else {
        console.error("Noma'lum xato yuz berdi:", err)
        return {
          status: 500,
          message: "Foydalanuvchini yangilashda noma'lum xato yuz berdi.",
        }
      }
    }
  }

  async deleteUser(uuid: string): Promise<{ status: string; message: string }> {
    try {
      // Try to delete the user based on the provided uuid
      await prisma.user.delete({
        where: { uuid }, // Use the uuid to locate the user to delete
      })

      // If the delete operation is successful, return a success message
      return {
        status: '200',
        message: `User with UUID ${uuid} successfully deleted.`,
      }
    } catch (err: unknown) {
      // If the user doesn't exist or there's another error, return an error message
      if (err instanceof Error) {
        console.error('Error occurred while deleting the user:', err)
        return {
          status: '500',
          message: `An error occurred while deleting the user: ${err.message}`,
        }
      } else {
        console.error('Unknown error occurred during delete operation:', err)
        return {
          status: '500',
          message: 'An unknown error occurred while deleting the user.',
        }
      }
    }
  }
  async verifyPin(uuid: string, pin: string): Promise<boolean> {
    const record = await prisma.user.findUnique({
      where: { uuid },
    })

    if (!record) return false
    console.log('Verifying PIN:', pin, 'against stored PIN:', record.pin)
    return bcrypt.compare(pin, record.pin)
  }

  async changePin(uuid: string, newPin: string): Promise<{ status: number; message: string }> {
    try {
      await prisma.user.update({
        where: { uuid },
        data: { pin: newPin },
      })

      return {
        status: 200,
        message: 'PIN muvaffaqiyatli yangilandi.',
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error occurred while changing PIN:', err)

        return {
          status: 500,
          message: `An error occurred while changing the PIN: ${err.message}`,
        }
      } else {
        console.error('Unknown error occurred while changing PIN:', err)
        return {
          status: 500,
          message: 'An unknown error occurred while changing the PIN.',
        }
      }
    }
  }
  async findByPhoneOrDeviceId(deviceId: string, phone?: string): Promise<User | null> {
    if (!phone && !deviceId) return null

    const orConditions: Prisma.UserWhereInput[] = []

    if (phone) {
      orConditions.push({ phone })
    }

    if (deviceId) {
      orConditions.push({ deviceId: { has: deviceId } })
    }

    const record = await prisma.user.findFirst({
      where: {
        OR: orConditions,
      },
    })

    if (!record) return null

    return new User(
      record.uuid,
      record.name,
      record.phone,
      record.pin,
      record.deviceId,
      record.id,
      record.role,
      record.profileImage,
      record.createdAt,
      record.lastLogin
    )
  }

  async updateDeviceId(phone: string, deviceId: string): Promise<User | null> {
    // 1️⃣ Find user by phone
    const record = await prisma.user.findUnique({
      where: { phone },
    })

    if (!record) return null

    const existingIds = record.deviceId || []
    let updatedDeviceIds = existingIds

    // 2️⃣ Add new deviceId if it doesn't exist
    if (deviceId && !existingIds.includes(deviceId)) {
      updatedDeviceIds = [...existingIds, deviceId]
    }

    // 3️⃣ Update lastLogin and deviceId if needed
    const updated = await prisma.user.update({
      where: { phone },
      data: {
        deviceId: updatedDeviceIds,
        lastLogin: new Date(),
      },
    })

    // 4️⃣ Return updated User entity
    return new User(
      updated.uuid,
      updated.name,
      updated.phone,
      updated.pin,
      updated.deviceId,
      updated.id,
      updated.role,
      updated.profileImage,
      updated.createdAt,
      updated.lastLogin
    )
  }

  async updateLastLogin(phone: string): Promise<void> {
    const nowUtc = new Date()

    await prisma.user.updateMany({
      where: { phone },
      data: { lastLogin: nowUtc },
    })
  }
}
