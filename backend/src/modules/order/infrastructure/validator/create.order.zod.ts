// validators/create-order.validator.ts
import { z } from "zod";

export const CreateOrderItemSchema = z.object({
  playlistId: z.string().nonempty(),
  price: z.number().int().positive(),
  currency: z.string().default("UZS"),
});

export const CreateOrderSchema = z.object({
  userId: z.string().nonempty(),
  items: z.array(CreateOrderItemSchema).min(1),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;