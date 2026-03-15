import { z } from 'zod'
import { PlaylistStatus, Visibility } from '@prisma/client'

export const createPlaylistSchema = z.object({
  title: z.string().trim().min(1, 'Sarlavha kerak'),
  description: z.string().trim(),
  playlistThumbnailUrl: z.string().trim(),
  price: z.number().int().positive(),
  categories: z.array(
    z.object({
      uuid: z.uuid(),
      name: z.string().trim().min(1),
    })
  ).min(1, 'Kamida bitta kategoriya tanlang'),
  visibility: z.enum(Visibility),
  status: z.enum(PlaylistStatus)
})
  .transform((obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  });

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>
