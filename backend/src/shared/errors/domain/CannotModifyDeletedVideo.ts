import { BaseDomainError } from './BaseDomainError'

export class CannotModifyDeletedVideoError extends BaseDomainError {
  readonly code = 'CANNOT_MODIFY_DELETED_VIDEO'

  constructor(videoId: string) {
    super(`Cannot modify deleted video with id: ${videoId}`)
  }
}
