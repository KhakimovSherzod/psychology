import type { Video } from '../../domain/entities/video.entity'
import type { CreateVideoDto } from '../service/video.service'

export interface IVideoRepository {
  createVideo(dto: CreateVideoDto): Promise<Video>
  getAllVideos(): Promise<Video[]>
  upsertVideo(video: Video): Promise<Video>
}
