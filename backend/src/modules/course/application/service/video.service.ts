import axios from 'axios'

export class VideoService {
  async generateSignedVideoUploadUrl() {
    const libraryId = process.env.BUNNY_LIBRARY_ID
    const apiKey = process.env.BUNNY_API_KEY

    // Creating video object in Bunny
    const ReqUploadId = await axios.post(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        title: 'New Video Upload',
      },
      {
        headers: {
          AccessKey: apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    const videoId = ReqUploadId.data.guid
    const uploadUrl = ReqUploadId.data.upload_url // <-- correct property name

    console.log('Generated video ID:', videoId, 'upload URL:', uploadUrl)
    console.log('Bunny API response data:', ReqUploadId)

    return { videoId, uploadUrl }
  }
}
