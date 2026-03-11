import type { VideoProvider, VideoStatus } from "@prisma/client"

export type VideoUserDTO = {
  uuid: string;
  title: string;
  videoThumbnailUrl: string;
  order: number;

  description?: string;

  isFree: boolean;

  categories: { id: string; name: string }[];

  // NEW: indicates whether user can access/watch the video
  hasAccess: boolean;
};

export type VideoAdminDTO = {
  uuid: string
  provider: VideoProvider
  externalVideoId: string
  title: string
  videoThumbnailUrl: string
  status: VideoStatus
  order: number
  categories: { id: string; name: string }[]
  description?: string
  isFree: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  publishedAt?: Date
  archivedAt?: Date
}
