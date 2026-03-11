import { z } from "zod"

export const PinValidatorSchema = z
  .string()
  .regex(/^\d{4}$/, "PIN must be exactly 4 digits")
