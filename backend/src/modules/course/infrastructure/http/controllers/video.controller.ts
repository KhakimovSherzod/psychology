import { VideoService } from '@/modules/course/application/service/video.service'
import { logger } from '@/utils/logger'
import type { Request, Response } from 'express'
import { VideoPrismaRepository } from '../../prisma/repository/video.prisma.repository'
import { YouTubeSyncService } from '@/modules/course/domain/service/youtubeSync.service'
import { PlaylistPrismaRepository } from '../../prisma/repository/playlist.prisma.repository'
interface CreateVideoDto {
  title: string
  description?: string
  playbackUrl: string
  videoThumbnailUrl?: string
  playlistId: string
  categories?: string[] // array of category UUIDs
}

export class VideoController {
  private videoRepo = new VideoPrismaRepository()
  private playlistRepo = new PlaylistPrismaRepository()
  private videoService = new VideoService(this.videoRepo)
  private youTubeSyncService = new YouTubeSyncService(
    this.playlistRepo,
    this.videoRepo
  )
  async generateSignedVideoUploadUrl(req: Request, res: Response): Promise<Response> {
    try {
      const uploadInfo = await this.videoService.generateSignedVideoUploadUrl()
      return res.status(200).json(uploadInfo)
    } catch (error) {
      console.error('generateSignedVideoUploadUrl error:', error)
      return res.status(500).json({ error: 'Failed to generate signed upload URL' })
    }
  }

  async uploadVideoThumbnails(req: Request, res: Response): Promise<Response> {
    try {
      const { libraryId, videoId } = req.body
      const file = req.file

      if (!libraryId) return res.status(400).json({ error: 'libraryId is required' })
      if (!videoId) return res.status(400).json({ error: 'videoId is required' })
      if (!file) return res.status(400).json({ error: 'thumbnail file is required' })

      const thumbnailUrl = await this.videoService.uploadVideoThumbnails(
        libraryId,
        videoId,
        file.buffer,
        file.mimetype
      )

      return res.status(200).json({ thumbnailUrl })
    } catch (error) {
      console.error('uploadVideoThumbnails error:', error)
      return res.status(500).json({ error: 'Failed to upload video thumbnail' })
    }
  }

  async createVideo(req: Request, res: Response): Promise<Response> {
    const dto: CreateVideoDto = req.body

    // ------------------- Technical validation -------------------
    if (!dto.title || dto.title.trim() === '') {
      logger.warn('Video creation failed: title is required')
      return res.status(400).json({ error: 'Title is required' })
    }

    if (!dto.playbackUrl || dto.playbackUrl.trim() === '') {
      logger.warn('Video creation failed: playbackUrl is required')
      return res.status(400).json({ error: 'Playback URL is required' })
    }

    if (!dto.playlistId || dto.playlistId.trim() === '') {
      logger.warn('Video creation failed: playlistId is required')
      return res.status(400).json({ error: 'Playlist ID is required' })
    }

    logger.info('Creating video: %s', dto.title)

    // ------------------- Call Service -------------------
    const video = await this.videoService.createVideo(dto)

    logger.info('Video created with UUID: %s', video.uuid)
    return res.status(201).json(video)
  }

  async getAllVideos(req:Request,res:Response): Promise<Response>{
    logger.info('Request to get all videos in controller getAllVideos function');
    const videos = await this.videoService.getAllVideos();
    logger.info('All videos successfully fetched')
    return res.status(200).json(videos)
  }

  async syncYouTube(req: Request, res: Response) {
  try {
    logger.info('Starting YouTube content sync...')
    const result = await this.youTubeSyncService.sync()
    logger.info('YouTube content synced: %d playlists, %d videos', result.playlists, result.videos)
    return res.status(200).json(result)
  } catch (err) {
    logger.error('YouTube content sync failed: %s', err instanceof Error ? err.message : String(err)) 
    return res.status(500).json({ error: 'Failed to sync YouTube content' })
  }
}

}
