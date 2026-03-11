import { BaseDomainError } from './BaseDomainError'

export class CannotArchiveAlreadyArchivedVideo extends BaseDomainError {
  readonly code = 'CANNOT_ARCHIVE_ALREADY_ARCHIVED_VIDEO'
  constructor(videoId: string) {
    super(`Video ${videoId} is already archived`)
  }
}
