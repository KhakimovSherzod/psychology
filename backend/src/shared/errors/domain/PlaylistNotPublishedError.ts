import { BaseDomainError } from "./BaseDomainError"

export class PlaylistNotPublishedError extends BaseDomainError {
  readonly code = "PLAYLIST_NOT_PUBLISHED"

  constructor() {
    super("Ushbu playlist hali nashr qilinmagan.")
  }
}
