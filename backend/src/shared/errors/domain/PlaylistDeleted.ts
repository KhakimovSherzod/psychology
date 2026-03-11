import { BaseDomainError } from "./BaseDomainError"

export class PlaylistDeletedError extends BaseDomainError{
  readonly code = "PLAYLIST_DELETED"

  constructor() {
    super("Ushbu playlist o‘chirilgan.")
  }
}
