import { z } from 'zod';

export const updatePlaylistSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    description: z.string().trim().optional(),
    playlistThumbnailUrl: z.string().trim().url('Must be a valid URL').optional(),
    order: z.number().int().positive().optional(),
  })
  .transform((obj) => {
    // remove undefined properties
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
  });

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
