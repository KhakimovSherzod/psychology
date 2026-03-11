import axios from 'axios'
import crypto from 'crypto'
import type { Video } from '../../domain/entities/video.entity'
import type { VideoStreamingProvider } from '../../domain/ports/video.stream.provider'
import type { VideoStatus } from '@prisma/client'
import type { IVideoRepository } from '../../domain/repository/video.repository'
import type {  VideoAdminDTO, VideoUserDTO } from '../DTO/video.user.dto'



export class VideoService {
  constructor(private VideoRepo: IVideoRepository, private streaming: VideoStreamingProvider) {}

  async generateSignedVideoUploadUrl() {
    const libraryId = process.env.BUNNY_LIBRARY_ID
    const apiKey = process.env.BUNNY_API_KEY

    if (!libraryId || !apiKey) throw new Error('Missing Bunny credentials')

    // 1️⃣ Create a new video object in Bunny
    const createRes = await axios.post(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      { title: 'New Video Upload' },
      {
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    const videoId = createRes.data.guid

    // 2️⃣ Generate presigned SHA256 signature for TUS
    const expires = Math.floor(Date.now() / 1000) + 3600 // 1 hour
    const signature = crypto
      .createHash('sha256')
      .update(`${libraryId}${apiKey}${expires}${videoId}`)
      .digest('hex')

    // 3️⃣ Return presigned TUS upload info to frontend
    return {
      videoId,
      tusUpload: {
        uploadUrl: 'https://video.bunnycdn.com/tusupload',
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: expires.toString(),
          LibraryId: libraryId,
          VideoId: videoId,
        },
      },
    }
  }

  async uploadVideoThumbnails(
    libraryId: string,
    videoId: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const apiKey = process.env.BUNNY_API_KEY
    if (!apiKey) throw new Error('Missing Bunny API key')

    const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/thumbnail`

    const res = await axios.post(url, fileBuffer, {
      headers: {
        AccessKey: apiKey,
        'Content-Type': mimeType,
      },
    })

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to upload thumbnail')
    }

    return `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`
  }




  async getAllUserVideos() {
    return await this.VideoRepo.getAllVideos()
  }
  
async getAllAdminVideos(options?: {
  status?: VideoStatus | 'ALL';
  includeDeleted?: boolean;
}): Promise<Video[]> {
  // Default for admin: return all statuses and include deleted
  const status = options?.status ?? 'ALL';
  const includeDeleted = options?.includeDeleted ?? true;

  return await this.VideoRepo.getAllVideos({
    status,
    includeDeleted,
  });
}





  async getVideoPlaybackUrl (uuid:string, user_uuid:string){
    console.log('get video playback url in service')
    const video = await this.VideoRepo.findByUUID(uuid)
    console.log("video playback url o%", video)

    //TODO need to update make new infrastructure implementation for bunny and domain ports/interfaces
    const signed_url = await this.streaming.getPlaybackUrl(video.id)
    console.log('signed url %s', signed_url)
    return signed_url
  }
async getUserVideoByUUID(uuid: string): Promise<VideoUserDTO> {
  const video = await this.VideoRepo.findByUUID(uuid)

  return {
    uuid: video.id,
    title: video.titleValue,
    videoThumbnailUrl: video.videoThumbnailUrlValue,
    order: video.orderValue,
    isFree: video.isFreeValue,
    categories: video.categoriesValue.map(category => ({
      id: category.uuid,
      name: category.name,
    })),
    ...(video.descriptionValue !== undefined && {
      description: video.descriptionValue,
    }),
  }
}

async getAdminVideoByUUID(uuid: string): Promise<VideoAdminDTO> {
  const video = await this.VideoRepo.findByUUID(uuid)
  return {
    uuid: video.id,
    provider: video.providerValue,
    externalVideoId: video.externalId,
    title: video.titleValue,
    videoThumbnailUrl: video.videoThumbnailUrlValue,
    status: video.statusValue,
    order: video.orderValue,
    isFree: video.isFreeValue,
    categories: video.categoriesValue.map(category => ({
      id: category.uuid,
      name: category.name,
    })),
    ...(video.createdAtValue !== undefined && {
      createdAt: video.createdAtValue,
    }),
    ...(video.descriptionValue !== undefined && {
      description: video.descriptionValue,
    }),


    ...(video.updatedAtValue !== undefined && {
      updatedAt: video.updatedAtValue,
    }),

    ...(video.deletedAtValue !== undefined && {
      deletedAt: video.deletedAtValue,
    }),

    ...(video.publishedAtValue !== undefined && {
      publishedAt: video.publishedAtValue,
    }),

    ...(video.archivedAtValue !== undefined && {
      archivedAt: video.archivedAtValue,
    }),
  }
}

}
