import { z } from 'zod'

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Telefon raqam tog'ri formatda bolishi kerak")
    .min(10, "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak")
    .max(15, "Telefon raqam 15 tadan ko'p bo'lmasligi kerak")
    .nonempty('Telefon raqam kiritilishi kerak')
    .optional(),
  deviceId: z.uuid("Notog'ri format").nonempty('Device ID kiritilishi kerak'),
  pin: z
    .string()
    .length(4, "PIN kodi 4 ta sondan iborat bo'lishi kerak")
    .nonempty('PIN kodi kiritilishi kerak'),
})
