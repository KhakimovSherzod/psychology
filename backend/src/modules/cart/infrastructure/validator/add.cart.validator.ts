import { z } from "zod"

export const addToCartSchema = z.object({
  playlistId: z.string(),
})


export type AddToCartDTO = z.infer<typeof addToCartSchema>