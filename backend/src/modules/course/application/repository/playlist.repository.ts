import type { Playlist } from '../../domain/entities/playlist.entity'
import type { Video } from '../../domain/entities/video.entity'

interface CreatePlaylistDto {
  title: string
  description?: string
  playlistThumbnailUrl?: string
  order?: number
}

interface UpdatePlaylistDto {
  title?: string
  description?: string
  playlistThumbnailUrl?: string
  order?: number
}

export interface IPlaylistRespository {
  // -------------------- READ --------------------
  getCoursePlaylists(): Promise<Playlist[]> // Get all playlists
  getVideosInPlaylistByUuid(uuid: string): Promise<Video[] | null> 

  // -------------------- CREATE --------------------
  createPlaylist(data: CreatePlaylistDto): Promise<Playlist>

  // -------------------- UPDATE --------------------
  updatePlaylist(uuid: string, data: UpdatePlaylistDto): Promise<Playlist | null>

  // -------------------- DELETE --------------------
  deletePlaylist(uuid: string): Promise<boolean>

  upsertPlaylist(playlist: Playlist): Promise<Playlist>
}
