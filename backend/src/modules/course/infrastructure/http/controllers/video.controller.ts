import { VideoService } from '@/modules/course/application/service/video.service'
import type { Request, Response } from 'express'

export class VideoController {
  private videoService = new VideoService()

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
    const { libraryId, videoId } = req.body;
    const file = req.file;

    if (!libraryId) return res.status(400).json({ error: "libraryId is required" });
    if (!videoId) return res.status(400).json({ error: "videoId is required" });
    if (!file) return res.status(400).json({ error: "thumbnail file is required" });

    const thumbnailUrl = await this.videoService.uploadVideoThumbnails(
      libraryId,
      videoId,
      file.buffer,
      file.mimetype
    );

    return res.status(200).json({ thumbnailUrl });
  } catch (error) {
    console.error("uploadVideoThumbnails error:", error);
    return res.status(500).json({ error: "Failed to upload video thumbnail" });
  }
}

}
