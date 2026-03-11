import { BaseDomainError } from "./BaseDomainError"

export class PlaylistNotPublicError extends BaseDomainError {
  readonly code = "PLAYLIST_NOT_PUBLIC"

  constructor() {
    super("Ushbu playlist ommaga ochiq emas.")
  }
}
