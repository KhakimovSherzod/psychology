import { User } from '../../../domain/entities/user.entity'
import { prisma } from '../client'

export class PrismaUserRepository {
  async create(user: User): Promise<User> {
    const record = await prisma.user.create({
      data: {
        uuid: user.uuid,
        name: user.name,
        phone: user.phone,
        pin: user.pin,
        verified: user.verified,
        deviceId: user.deviceId,
      },
    })

    return new User(
      record.uuid,
      record.name,
      record.phone,
      record.pin,
      record.verified,
      record.deviceId,
      record.id,
      record.role,
      record.subscriptionType,
      record.subscriptionValidTill,
      record.profileImage,
      record.createdAt,
      record.lastLogin
    )
  }

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
      record.verified,
      record.deviceId,
      record.id,
      record.role,
      record.subscriptionType,
      record.subscriptionValidTill,
      record.profileImage,
      record.createdAt,
      record.lastLogin
    )
  }
}
