import { BaseRepositoryError } from '../errors/BaseRepositoryError'
import { DatabaseError } from '../errors/DatabaseError'
import { UserMappingError } from '../errors/UserMappingError'
import { UserNotFound } from '../errors/UserNotFound.error'

export function errorMiddleware(err: unknown, req: any, res: any, next: any) {
  // Log the full error stack for debugging
  console.error(err)

  if (err instanceof BaseRepositoryError) {
    // You can customize HTTP status per error type
    let status = 500

    if (err instanceof DatabaseError) status = 500
    if (err instanceof UserMappingError) status = 500 // still server error, but can distinguish by code
    if (err instanceof UserNotFound) status = 404
    return res.status(status).json({
      code: err.code,
      message: err.message,
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
