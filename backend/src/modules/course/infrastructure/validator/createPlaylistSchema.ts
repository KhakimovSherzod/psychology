import { z } from 'zod'
import { PlaylistStatus } from '@prisma/client'

export const createPlaylistSchema = z.object({
  title: z.string().trim().min(1, 'Sarlavha kerak'),
  categories: z.array(
    z.object({
      uuid: z.string().uuid(),
      name: z.string().trim().min(1),
    })
  ).min(1, 'Kamida bitta kategoriya tanlang'),
  description: z.string().trim().optional(),
  playlistThumbnailUrl: z.string().trim().optional(),
  price: z.number().int().positive(),
  visibility: z.enum(['PRIVATE', 'UNLISTED', 'PUBLIC']).default('PRIVATE'),
  status: z.enum(PlaylistStatus).default('DRAFT')
})
  .transform((obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  });

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>
