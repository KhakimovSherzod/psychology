import axios, { type AxiosResponse } from 'axios'
import { Playlist } from '@/modules/course/domain/entities/playlist.entity'
import { Video } from '@/modules/course/domain/entities/video.entity'
import { logger } from '@/utils/logger'
import type { IPlaylistRespository } from '../../application/repository/playlist.repository'
import type { IVideoRepository } from '../../application/repository/video.repository'

interface YouTubePlaylist {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
}

interface YouTubeVideo {
  id: string
  title: string
  description?: string
  thumbnailUrl?: string
  position?: number
}

const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!
const YOUTUBE_API_KEY = process.env.GOOGLE_CLOUD_CONSOLE_YOUTUBE_API_KEY!

export class YouTubeSyncService {
  constructor(private playlistRepo: IPlaylistRespository, private videoRepo: IVideoRepository) {}

  async sync(): Promise<{ playlists: number; videos: number }> {
    let playlistsSynced = 0
    let videosSynced = 0

    logger.info('Starting YouTube sync in service...')

    try {
      const playlistsData: YouTubePlaylist[] = await this.fetchPlaylistsFromYouTube()
      logger.info('Fetched %d playlists from YouTube', playlistsData.length)
        
      for (const p of playlistsData) {
        const playlist = new Playlist(p.id, p.title, p.description, p.thumbnailUrl)

        await this.playlistRepo.upsertPlaylist(playlist)
        playlistsSynced++
        logger.info('Synced playlist: %s', p.title)

        const videosData: YouTubeVideo[] = await this.fetchVideosFromYouTubePlaylist(p.id)
        logger.info('Fetched %d videos for playlist %s', videosData.length, p.title)

        for (const v of videosData) {
          const video = new Video(
            v.id,
            v.title,
            `https://www.youtube.com/embed/${v.id}`,
            playlist.uuid,
            v.description,
            v.thumbnailUrl,
            v.position
          )

          await this.videoRepo.upsertVideo(video)
          videosSynced++
          logger.info('Synced video: %s', v.title)
        }
      }
    } catch (err) {
      logger.error('Error syncing YouTube data: %o', err)
    }

    logger.info('YouTube sync finished. Playlists: %d, Videos: %d', playlistsSynced, videosSynced)
    return { playlists: playlistsSynced, videos: videosSynced }
  }

  private async fetchPlaylistsFromYouTube(): Promise<YouTubePlaylist[]> {
    logger.info('Fetching playlists from YouTube API...')
    const url = `https://www.googleapis.com/youtube/v3/playlists`
    const playlists: YouTubePlaylist[] = []

    let nextPageToken: string | undefined = undefined

    do {
      const res: AxiosResponse = await axios.get(url, {
        params: {
          part: 'snippet',
          channelId: YOUTUBE_CHANNEL_ID,
          maxResults: 50,
          pageToken: nextPageToken,
          key: YOUTUBE_API_KEY,
        },
      })

      const items = res.data.items
      items.forEach((item: any) => {
        playlists.push({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails?.default?.url,
        })
      })

      nextPageToken = res.data.nextPageToken
    } while (nextPageToken)

    return playlists
  }

  private async fetchVideosFromYouTubePlaylist(playlistId: string): Promise<YouTubeVideo[]> {
    logger.info('Fetching videos for playlist %s from YouTube API...', playlistId)
    const url = `https://www.googleapis.com/youtube/v3/playlistItems`
    const videos: YouTubeVideo[] = []

    let nextPageToken: string | undefined = undefined

    do {
      const res: AxiosResponse = await axios.get(url, {
        params: {
          part: 'snippet,contentDetails',
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: YOUTUBE_API_KEY,
        },
      })

      const items = res.data.items
      items.forEach((item: any, index: number) => {
        videos.push({
          id: item.contentDetails.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails?.default?.url,
          position: item.snippet.position,
        })
      })

      nextPageToken = res.data.nextPageToken
    } while (nextPageToken)

    return videos
  }
}
