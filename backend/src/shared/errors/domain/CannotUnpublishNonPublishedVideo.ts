import { BaseDomainError } from './BaseDomainError'

export class CannotUnpublishNonPublishedVideo extends BaseDomainError {
  readonly code = 'CANNOT_UNPUBLISH_NON_PUBLISHED_VIDEO'

  constructor(public readonly videoId: string) {
    super(`Cannot unpublish video "${videoId}" because it is not published.`)
  }
}
