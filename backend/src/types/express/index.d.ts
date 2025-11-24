import type { AccessTokenPayload } from '../../lib/verify-jwt'

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload | null
    }
  }
}
