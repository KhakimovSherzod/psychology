import type { VideoStatus } from '@prisma/client'
import type { Video } from '../../domain/entities/video.entity'

export interface IVideoRepository {
  createVideo(video: Video, playlistId: string): Promise<Video>
  getAllVideos(options?: {
    status?: VideoStatus | 'ALL'
    includeDeleted?: boolean
  }): Promise<Video[]>
  findByUUID(uuid: string): Promise<Video>
}
