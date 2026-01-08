import { z } from 'zod'

export const ResetPinPhoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Telefon raqam tog'ri formatda bolishi kerak")
    .min(10, "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak")
    .max(15, "Telefon raqam 15 tadan ko'p bo'lmasligi kerak"),
})
