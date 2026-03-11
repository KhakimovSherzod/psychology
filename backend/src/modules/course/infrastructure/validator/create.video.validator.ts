import { VideoProvider, VideoStatus } from '@prisma/client'
import { z } from 'zod'

export const createVideoSchema = z.object({
  provider: z.enum(VideoProvider),
  externalVideoId: z
    .string()
    .min(1) 
    .transform(str => str.trim()),
  title: z
    .string()
    .min(1)
    .transform(str => str.trim()),
  description: z
    .string()
    .optional()
    .transform(desc => desc?.trim()),
  videoThumbnailUrl: z.url(),
  status: z.enum(VideoStatus).default(VideoStatus.DRAFT),
  order: z.number().int().optional(),
  categories: z.array(z.uuid()).default([]),
  isFree: z.boolean().optional().default(false),
})

export type CreateVideoDto = z.infer<typeof createVideoSchema>
