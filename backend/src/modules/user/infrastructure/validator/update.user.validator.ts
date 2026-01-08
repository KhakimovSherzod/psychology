import { z } from 'zod'

// Schema for the request body
export const updateUserCredentialsSchema = z
  .object({
    name: z
      .string()
      .min(1, "Ism 1 ta xarfdan kam bo'lmasligi kerak")
      .max(50, "Ism 50 tadan ko'p bo'lmasligi kerak")
      .nonempty('Ism kiritilishi kerak')
      .optional(),

    phone: z
      .string()
      .regex(/^[+]?[0-9]{10,15}$/, "Telefon raqam tog'ri formatda bolishi kerak")
      .min(10, "Telefon raqam 10 ta xarfdan kam bo'lmasligi kerak")
      .max(15, "Telefon raqam 15 tadan ko'p bo'lmasligi kerak")
      .nonempty('Telefon raqam kiritilishi kerak')
      .optional(),

    pin: z
      .string()
      .length(4, "PIN kodi 4 ta sondan iborat bo'lishi kerak")
      .nonempty('PIN kodi kiritilishi kerak')
      .optional(),

    profileImage: z
      .url("Profil rasmi to'g'ri URL formatda bo'lishi kerak")
      .nonempty('Profil rasmi kiritilishi kerak')
      .optional(),
  })
  // This ensures at least one of the optional fields is present
  .refine(data => Object.keys(data).length > 0, {
    message: 'Kamida bitta maydonni yangilash kerak',
  })

// UUID validation can be separate since it's coming from req.user
export const uuidParamSchema = z
  .uuid("Noto'g'ri UUID formati")
  .nonempty('Foydalanuvchi UUID kiritilishi kerak')
