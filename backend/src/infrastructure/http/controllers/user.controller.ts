// infrastructure/http/controllers/user.controller.ts
import type { NextFunction, Request, Response } from 'express'
import { RegisterUserService } from '../../../application/services/register-user.service'
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt'
import { PrismaUserRepository } from '../../prisma/repositories/user.prisma.repository'

export class UserController {
  private userRepo = new PrismaUserRepository()
  private registerService = new RegisterUserService(this.userRepo)

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, pin, deviceId } = req.body

      // Call service to create user and generate tokens
      const { createdUser } = await this.registerService.execute({
        name,
        phone,
        pin,
        deviceId,
      })

      const accessToken = await generateAccessToken({
        uuid: createdUser.uuid,
        role: createdUser.role || 'USER',
        res,
      })

      const refreshToken = await generateRefreshToken({ uuid: createdUser.uuid, res })

      if (accessToken && refreshToken) {
        console.log(
          'access token set successfully',
          accessToken,
          'refresh token was set successfully',
          refreshToken
        )
      } else {
        throw new Error('tokens were not set successfully')
      }

      res.status(201).json({
        createdUser,
        message: 'User registered successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  async me(req: Request, res: Response) {
    const access_token = req.cookies['access_token']
    const refresh_token = req.cookies['refresh_token']

    console.log('All cookies received:', req.cookies)
    console.log('Access token:', access_token)
    console.log('Refresh token:', refresh_token)

    if (!access_token && !refresh_token) {
      return res.status(401).json({
        message: 'JWT tokens not found',
        receivedCookies: req.cookies,
      })
    }

    return res.json({
      access_token: access_token,
      refresh_token: refresh_token,
      message: 'Tokens found in cookies',
    })
  }
}
