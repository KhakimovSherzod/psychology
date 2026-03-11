import type { VideoStreamingProvider } from '@/modules/course/domain/ports/video.stream.provider'

import CryptoJS from 'crypto-js'
export class BunnyStreamingProvider implements VideoStreamingProvider {
  async getPlaybackUrl(uuid: string, expiresInSeconds = 3600): Promise<string> {
    const libraryId = process.env.BUNNY_LIBRARY_ID!
    const secret = process.env.BUNNY_AUTHENTICATION_TOKEN_KEY!

    if (!libraryId || !secret) throw new Error('Bunny credentials missing')

    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
    const path = `/embed/${libraryId}/${uuid}`

    // HMAC in lowercase hex
    const hash = CryptoJS.SHA256(secret + uuid + expires).toString(CryptoJS.enc.Hex)

    return `http://iframe.mediadelivery.net${path}?token=${hash}&expires=${expires}`
  }
}
