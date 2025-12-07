
import { VideoService } from '@/modules/course/application/service/video.service'
import type { Request, Response } from 'express'

export class VideoController {
  private videoService = new VideoService()

  async generateSignedVideoUploadUrl(req: Request, res: Response): Promise<Response> {
    try {
      const uploadUrl = await this.videoService.generateSignedVideoUploadUrl()
      return res.status(200).json({ uploadUrl })
    } catch (error) {
      console.error('generateSignedVideoUploadUrl error:', error)
      return res.status(500).json({ error: 'Failed to generate signed upload URL' })
    }
  }
}
