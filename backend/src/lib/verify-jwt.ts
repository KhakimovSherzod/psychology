import type { UserRole } from '@/shared/enums/UserRole.enum'
import jwt from 'jsonwebtoken'

export type AccessTokenPayload = {
  sub: string
  role: UserRole
}

export type RefreshTokenPayload = {
  sub: string
}

/**
 * Async version of jwt.verify for access tokens
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  return new Promise(resolve => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.error('Access token verification failed:', err)
        return resolve(null)
      }
      resolve(decoded as AccessTokenPayload)
    })
  })
}

/**
 * Async version of jwt.verify for refresh tokens
 */
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  return new Promise(resolve => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.error('Refresh token verification failed:', err)
        return resolve(null)
      }
      resolve(decoded as RefreshTokenPayload)
    })
  })
}
