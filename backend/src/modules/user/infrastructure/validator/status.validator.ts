import { UserStatus } from '@/shared/enums/UserStatus.enum'
import { z } from 'zod'

export const updateUserStatusSchema = z.object({
  uuid: z.string().uuid("Noto'g'ri UUID formati"),
  status: z.enum(
    [
      UserStatus.PENDING,
      UserStatus.ACTIVE,
      UserStatus.INACTIVE,
      UserStatus.SUSPENDED,
      UserStatus.BANNED,
      UserStatus.DELETED,
    ],
    "Noto'g'ri foydalanuvchi statusi"
  ),
})
