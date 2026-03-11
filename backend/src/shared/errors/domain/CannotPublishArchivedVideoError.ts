import { BaseDomainError } from './BaseDomainError'

export class CannotPublishArchivedVideo extends BaseDomainError {
  readonly code = 'CANNOT_PUBLISH_ARCHIVED_VIDEO'

  constructor(videoId: string) {
    super(`Cannot publish archived video with id: ${videoId}`)
  }
}
