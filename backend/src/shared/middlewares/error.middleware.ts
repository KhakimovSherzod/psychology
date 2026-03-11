import { logger } from '@/utils/logger'
import { BaseApplicationError } from '../errors/application/BaseApplicationError'
import { UserAlreadyExist } from '../errors/application/UserAlreadyExist'
import { BaseRepositoryError } from '../errors/repository/BaseRepositoryError'
import { DatabaseError } from '../errors/repository/DatabaseError'
import { UserMappingError } from '../errors/repository/UserMappingError'
import { UserNotFound } from '../errors/repository/UserNotFound.error'
import { InvalidPinVerification } from '../errors/application/InvalidPinVerification'
import { ZodError } from 'zod'
import { BaseDomainError } from '../errors/domain/BaseDomainError'
import { CannotPublishArchivedVideo } from '../errors/domain/CannotPublishArchivedVideoError'
import { CannotArchiveAlreadyArchivedVideo } from '../errors/domain/CannotArchiveAlreadyArchivedVideo'
import { CannotArchiveDraftVideo } from '../errors/domain/CannotArchiveDraftVideo'
import { CannotModifyDeletedVideoError } from '../errors/domain/CannotModifyDeletedVideo'
import { CannotUnpublishNonPublishedVideo } from '../errors/domain/CannotUnpublishNonPublishedVideo'
import { PlaylistNotFound } from '../errors/repository/PlaylistNotFound'
import { PlaylistDeletedError } from '../errors/domain/PlaylistDeleted'
import { PlaylistNotPublicError } from '../errors/domain/PlaylistNotPublishedError '
import { PlaylistNotPublishedError } from '../errors/domain/PlaylistNotPublishedError'
import { PriceCannotBeNegative } from '../errors/domain/PriceCannotBeNegative'

export function errorMiddleware(err: unknown, req: any, res: any, next: any) {
  // Log the full error stack for debugging
  console.error(err)

  if (err instanceof BaseRepositoryError) {
    // You can customize HTTP status per error type
    let status = 500

    if (err instanceof DatabaseError) status = 500
    if (err instanceof UserMappingError) status = 500 // still server error, but can distinguish by code
    if (err instanceof UserNotFound) status = 404
    if (err instanceof PlaylistNotFound) status = 404
    return res.status(status).json({
      code: err.code,
      message: err.message,
    })
  }

  if (err instanceof BaseApplicationError) {
    let status = 400

    if (err instanceof UserAlreadyExist) {
      status = 409
      logger.error(err)
    }
    if(err instanceof InvalidPinVerification){
      status = 401
      logger.error(err)
    }
   
    
    return res.status(status).json({
      code: err.code,
      message: err.message,
    })
  }
  if(err instanceof BaseDomainError){
    let status = 409
    if(err instanceof CannotPublishArchivedVideo){
      logger.error(err)
    }
    if(err instanceof CannotArchiveAlreadyArchivedVideo){
      logger.error(err)
    }
    if(err instanceof CannotArchiveDraftVideo){
      logger.error(err)
    }
    if(err instanceof CannotModifyDeletedVideoError){
      logger.error(err)
    }
    if(err instanceof CannotUnpublishNonPublishedVideo){
      logger.error(err)
    }
    if(err instanceof PlaylistDeletedError){
      status = 404
      logger.error(err)
    }
    if(err instanceof PlaylistNotPublicError){
      status = 404
      logger.error(err)
    }
    if(err instanceof PlaylistNotPublishedError){
      status = 404
      logger.error(err)
    }
    if(err instanceof PriceCannotBeNegative){
      status = 422
      logger.error(err)
    }
     return res.status(status).json({
      code: err.code,
      message: err.message,
    })
  }
 if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Tasdiqlash xatosi",
      errors: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
  }
  // Handle other known errors (optional)
  if (err instanceof Error) {
    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: err.message,
    })
  }

  // Fallback for unknown thrown values
  return res.status(500).json({
    code: 'UNEXPECTED_ERROR',
    message: 'Unexpected error occurred',
  })

}
