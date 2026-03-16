import { VideoProvider, VideoStatus } from '@prisma/client'
import { z } from 'zod'

export const createVideoSchema = z.object({
  provider: z.enum(VideoProvider),
  externalVideoId: z
    .string()
    .min(1).trim(),
  title: z
    .string()
    .min(1).trim(),
  description: z
    .string().trim(),
  videoThumbnailUrl: z.url(),
  status: z.enum(VideoStatus).default(VideoStatus.DRAFT),
  order: z.number().int().optional(),
  categories: z.array(z.uuid()).default([]),
  isFree: z.boolean().optional().default(false),
})

export type CreateVideoDto = z.infer<typeof createVideoSchema>
