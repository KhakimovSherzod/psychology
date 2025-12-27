import type { Playlist } from '@/modules/course/domain/entities/playlist.entity'
import type { Video } from '../../domain/entities/video.entity'
import type { IPlaylistRespository } from '../repository/playlist.repository'

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

export class PlaylistService {
  constructor(private playlistRepository: IPlaylistRespository) {}

  // -------------------- READ --------------------
  async getAllPlaylists(): Promise<Playlist[]> {
    return await this.playlistRepository.getCoursePlaylists()
  }

  async getVideosInPlaylistByUuid(uuid: string): Promise<Video[] | null> {
    return await this.playlistRepository.getVideosInPlaylistByUuid(uuid)
  }

  // -------------------- CREATE --------------------
  async createPlaylist(data: CreatePlaylistDto): Promise<Playlist> {
    return await this.playlistRepository.createPlaylist(data)
  }

  // -------------------- UPDATE --------------------
  async updatePlaylist(uuid: string, data: UpdatePlaylistDto): Promise<Playlist | null> {
    return await this.playlistRepository.updatePlaylist(uuid, data)
  }

  // -------------------- DELETE --------------------
  async deletePlaylist(uuid: string): Promise<boolean> {
    return await this.playlistRepository.deletePlaylist(uuid)
  }
}
