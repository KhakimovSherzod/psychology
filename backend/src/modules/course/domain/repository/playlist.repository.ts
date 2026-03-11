import type { PlaylistStatus, Visibility } from '@prisma/client'
import type { Playlist } from '../../domain/entities/playlist.entity'
import type { Video } from '../../domain/entities/video.entity'

interface UpdatePlaylistDto {
  title?: string
  description?: string
  playlistThumbnailUrl?: string
  order?: number
}

export interface IPlaylistRespository {
  // -------------------- READ --------------------

  getCoursePlaylists(options?: {
    status?: PlaylistStatus | 'ALL'
    visibility?: Visibility | 'ALL'
    includeDeleted?: boolean
  }): Promise<Playlist[]>

  getVideosInPlaylistByUuid(
    uuid: string,
    options?: {
      status?: PlaylistStatus | 'ALL'
      includeDeleted?: boolean
    }
  ): Promise<Video[]>

  findByUUID(uuid: string): Promise<Playlist>
  // -------------------- CREATE --------------------
  createPlaylist(data: Playlist): Promise<Playlist>

  // -------------------- UPDATE --------------------
  updatePlaylist(uuid: string, data: UpdatePlaylistDto): Promise<Playlist | null>

  // -------------------- DELETE --------------------
  deletePlaylist(uuid: string): Promise<boolean>


  savePlaylistVideos(playlist: Playlist): Promise<void>

  findExistingUuids(uuids: string[]): Promise<string[]> 
}
