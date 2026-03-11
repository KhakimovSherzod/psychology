import { BaseRepositoryError } from './BaseRepositoryError'

export class PlaylistNotFound extends BaseRepositoryError {
  readonly code = 'PLAYLIST_NOT_FOUND'
  readonly missingUuids: string[]

  constructor(uuid: string | string[]) {
    const ids = Array.isArray(uuid) ? uuid : [uuid]

    super(`Playlist(s) not found: ${ids.join(', ')}`)

    this.missingUuids = ids
  }
}