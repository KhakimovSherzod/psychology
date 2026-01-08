import { UserRole } from '@/shared/enums/UserRole.enum'
import { z } from 'zod'

export const updateUserRoleSchema = z.object({
  uuid: z.uuid("Noto'g'ri UUID formati"),
  role: z.enum([UserRole.USER, UserRole.ADMIN, UserRole.OWNER], "Noto'g'ri foydalanuvchi roli"),
})
