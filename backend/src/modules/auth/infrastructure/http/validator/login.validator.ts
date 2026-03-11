import { z } from 'zod'

export const loginSchema = z.object({
  deviceId: z.string().uuid("Notog'ri format").nonempty('Device ID kiritilishi kerak'),
  pin: z
    .string()
    .length(4, "PIN kodi 4 ta sondan iborat bo'lishi kerak")
    .nonempty('PIN kodi kiritilishi kerak'),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Telefon raqam tog'ri formatda bolishi kerak")
    .min(10, "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak")
    .max(15, "Telefon raqam 15 tadan ko'p bo'lmasligi kerak")
    .optional(),
  // Add device info fields as optional
  deviceName: z.string().optional(),
  deviceType: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  ipAddress: z
    .string()
    .regex(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "IP manzil noto'g'ri formatda"
    )
    .optional(),
  deviceToken: z.string().optional(),
})
