import axios from 'axios'
import crypto from 'crypto'

export class VideoService {
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

    // Bunny automatically makes the thumbnail available here:
    return `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`
  }
}
