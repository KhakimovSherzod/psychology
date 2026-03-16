import type { PlaylistStatus, Visibility } from '@prisma/client'
import type { CategorySchema } from '../../domain/types/category.entity.schema'

export type PlaylistAdminDTO = {
  id: string
  title: string
  visibility: Visibility
  status: PlaylistStatus

  price: number | null

  description: string
  playlistThumbnailUrl: string

  categories: CategorySchema[]

  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  archivedAt?: Date
}
export type PlaylistUserDTO = {
  id: string;
  title: string;
  price: number | null;

  playlistThumbnailUrl: string;
  categories: CategorySchema[];

  // optional but safe
  description: string;

  // new field to indicate if the user has access
  hasAccess: boolean;
};

