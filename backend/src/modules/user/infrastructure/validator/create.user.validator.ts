import { UserRole } from '@/shared/enums/UserRole.enum'
import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Ism 1 ta xarfdan kam bo'lmasligi kerak")
    .max(50, "Ism 50 tadan ko'p bo'lmasligi kerak"),

  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Telefon raqam tog'ri formatda bolishi kerak")
    .min(10, "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak")
    .max(15, "Telefon raqam 15 tadan ko'p bo'lmasligi kerak"),

  pin: z.string().length(4, "PIN kodi 4 ta sondan iborat bo'lishi kerak"),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
})
