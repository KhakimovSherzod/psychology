import { BaseDomainError } from './BaseDomainError'

export class CannotArchiveDraftVideo extends BaseDomainError {
  readonly code = 'CANNOT_ARCHIVE_DRAFT_VIDEO'
  constructor(videoId: string) {
    super(`DRAFT Video ${videoId} can not be archived `)
  }
}
