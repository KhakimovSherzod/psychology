import type { CreateVideoDto } from '@/modules/course/application/DTO/create.video.dto'
import { VideoService } from '@/modules/course/application/service/video.service'
import { YouTubeSyncService } from '@/modules/course/domain/service/youtubeSync.service'
import { uuidParamSchema } from '@/shared/validator/uuid.validator'
import { logger } from '@/utils/logger'
import type { VideoStatus } from '@prisma/client'
import type { Request, Response } from 'express'
import type { NextFunction } from 'express-serve-static-core'

export class VideoController {
  constructor(
    private readonly videoService:VideoService,
    private readonly youTubeSyncService:YouTubeSyncService
  ){}
  
  async generateSignedVideoUploadUrl(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const uploadInfo = await this.videoService.generateSignedVideoUploadUrl()
      res.status(200).json(uploadInfo)
    } catch (err) {
      next(err)
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




  async getAllUserVideos(req: Request, res: Response, next:NextFunction): Promise<void> {
    try{
      const videos = await this.videoService.getAllUserVideos()
      res.status(200).json(videos)
    }catch(err){
      next(err)
    }
  }

async getAllAdminVideos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Parse optional query params for admin filtering
    const status = (req.query.status as VideoStatus | 'ALL') ?? 'ALL';
    const includeDeleted = req.query.includeDeleted === 'true' ? true : true; // default true for admin

    const videos = await this.videoService.getAllAdminVideos({
      status,
      includeDeleted,
    });

    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
}


  async syncYouTube(req: Request, res: Response) {
    try {
      logger.info('Starting YouTube content sync...')
      const result = await this.youTubeSyncService.sync()
      logger.info(
        'YouTube content synced: %d playlists, %d videos',
        result.playlists,
        result.videos
      )
      return res.status(200).json(result)
    } catch (err) {
      logger.error(
        'YouTube content sync failed: %s',
        err instanceof Error ? err.message : String(err)
      )
      return res.status(500).json({ error: 'Failed to sync YouTube content' })
    }
  }
  async getVideoPlaybackUrl(req: Request, res: Response, next: NextFunction) {
    const uuid = uuidParamSchema.parse(req.params.uuid)
    const user_uuid = uuidParamSchema.parse(req.user?.sub)

    logger.info('in video controller course module getVideoPlaybackUrl get uuid: %s')
    const url = await this.videoService.getVideoPlaybackUrl(uuid, user_uuid)
    console.log(url)
    return res.status(200).json(url)
  }

 async getUserVideoByUUID(req:Request,res:Response, next:NextFunction):Promise<void>{
  try{
   const uuid = uuidParamSchema.parse(req.params.uuid);
   const video = await this.videoService.getUserVideoByUUID(uuid);
   res.status(200).json(video)
  }catch(err){
    next(err)
  }
 }

  async getAdminVideoByUUID(req:Request,res:Response, next:NextFunction):Promise<void>{
  try{
   const uuid = uuidParamSchema.parse(req.params.uuid);
   const video = await this.videoService.getAdminVideoByUUID(uuid);
   res.status(200).json(video)
  }catch(err){
    next(err)
  }
 }
}
