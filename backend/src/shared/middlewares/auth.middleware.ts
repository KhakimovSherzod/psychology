import type { ITokenService } from '@/modules/auth/application/ports/token.service'

import { UserService } from '@/modules/user/application/services/user.service'
import { RoleFactory } from '@/modules/user/domain/value-objects/RoleFactory'

import type { NextFunction, Request, Response } from 'express'

export class AuthMiddleware {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userService: UserService
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']

    // ------------------------------------------------
    // 1. ACCESS TOKEN
    // ------------------------------------------------
    if (accessToken) {
      const decoded = this.tokenService.verifyAccessToken(accessToken)

      if (decoded) {
        req.user = {
          sub: decoded.userId,
          role: RoleFactory.fromName(decoded.role),
        }
        return next()
      }
    }

    // ------------------------------------------------
    // 2. REFRESH TOKEN
    // ------------------------------------------------
    if (!refreshToken) {
      return res.status(401).json({ message: 'Autentifikatsiya talab qilinadi' })
    }
    console.log('Refresh token:', refreshToken) // Debugging log
    const decodedRefresh = this.tokenService.verifyRefreshToken(refreshToken)
    if (!decodedRefresh) {
      return res.status(401).json({ message: 'Yangilash belgisi yaroqsiz' })
    }

    // ------------------------------------------------
    // 3. LOAD USER
    // ------------------------------------------------
    const user = await this.userService.getUserByUUID(decodedRefresh.userId)

    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' })
    }

    // ------------------------------------------------
    // 4. ROTATE ACCESS TOKEN
    // ------------------------------------------------
    const newAccessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
    })
    console.log('Yangi access token:', newAccessToken) // Debugging log

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
      path: '/',
    })

    req.user = {
      sub: user.id,
      role: RoleFactory.fromName(user.role),
    }
    return next()
  }
}
