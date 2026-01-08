import type { NextFunction, Request, Response } from 'express'

import { UserService } from '@/modules/user/application/services/user.service'
import { RoleFactory } from '@/modules/user/domain/value-objects/RoleFactory'
import { generateAccessToken } from '../../lib/generate-jwt'
import { verifyAccessToken, verifyRefreshToken } from '../../lib/verify-jwt'
import { PrismaUserRepository } from '../../modules/user/infrastructure/prisma/repositories/user.prisma.repository'

const userService = new UserService(new PrismaUserRepository())

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['access_token']
  const refreshToken = req.cookies['refresh_token']

  console.log('access token', accessToken)
  console.log('refresh token', refreshToken)
  if (accessToken) {
    // --------------------------------------------------------
    // 1. CHECK ACCESS TOKEN
    // --------------------------------------------------------
    const decodedAccess = await verifyAccessToken(accessToken)

    if (decodedAccess) {
      req.user = {
        sub: decodedAccess.sub,
        role: RoleFactory.fromName(decodedAccess.role), // <-- Role instance
      }
      console.log('access token verified', decodedAccess)
      return next()
    }

    console.log('Access token invalid or expired.')
  }

  // --------------------------------------------------------
  // 2. IF ACCESS TOKEN INVALID → CHECK REFRESH TOKEN
  // --------------------------------------------------------
  if (!refreshToken) {
    console.error('refresh token does not exist')
    return res.status(401).json({ message: 'Authentication required: no refresh token' })
  }

  const decodedRefresh = await verifyRefreshToken(refreshToken)
  if (!decodedRefresh) {
    console.error('invalid refresh token')
    return res.status(401).json({ message: 'Invalid refresh token' })
  }

  // --------------------------------------------------------
  // 3. REFRESH TOKEN VALID → LOAD USER FROM DB
  // --------------------------------------------------------
  const uuid = decodedRefresh.sub
  const user = await userService.getUserByUUID(uuid)

  if (!user) {
    console.error('user not found when searched by uuid from refresh token')
    return res.status(404).json({ message: 'User not found' })
  }

  // --------------------------------------------------------
  // 4. GENERATE NEW ACCESS TOKEN
  // --------------------------------------------------------
  await generateAccessToken({
    uuid: user.uuid,
    role: user.role,
    res,
  })
  console.log('generated and setted access token to http only cookies')
  // Attach validated auth info for controller use
  req.user = {
    sub: user.uuid,
    role: RoleFactory.fromName(user.role),
  }

  return next()
}
