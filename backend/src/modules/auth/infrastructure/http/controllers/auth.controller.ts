// infrastructure/http/controllers/user.controller.ts

import { generateAccessToken, generateRefreshToken } from '@/lib/generate-jwt'
import { LoginUserService } from '@/modules/auth/application/service/login-user.service'
import { RegisterUserService } from '@/modules/auth/application/service/register-user.service'
import { PrismaUserRepository } from '@/modules/user/infrastructure/prisma/repositories/user.prisma.repository'
import type { Request, Response } from 'express'

export class AuthController {
  private userRepo = new PrismaUserRepository()
  private registerService = new RegisterUserService(this.userRepo)
  private loginService = new LoginUserService(this.userRepo)

  async register(req: Request, res: Response) {
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

      return res.status(201).json({
        createdUser,
        message: 'User registered successfully',
      })
    } catch (err) {
      return res.status(400).json({ message: err ?? 'User registration failed' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { phone, pin, deviceId } = req.body

      if (!pin) {
        return res.status(400).json({ message: 'PIN taqdim etilmagan' })
      }

      if (!phone && !deviceId) {
        return res.status(400).json({ message: 'Telefon yoki Qurilma ID taqdim etilmagan' })
      }

      const user = await this.loginService.login(deviceId, pin, phone)

      if (!user) {
        return res.status(401).json({ message: "Noto'gri pin yoki qurilma id" })
      }

      // generate tokens
      const accessToken = await generateAccessToken({
        uuid: user.uuid,
        role: user.role || 'USER',
        res,
      })

      const refreshToken = await generateRefreshToken({ uuid: user.uuid, res })

      if (!accessToken || !refreshToken) {
        throw new Error('Token generation failed')
      }
      console.log(
        'access token set successfully',
        accessToken,
        'refresh token was set successfully',
        refreshToken
      )
      return res.status(200).json({
        message: 'User logged in successfully',
      })
    } catch (err) {
      console.error('Login error:', err)

      let message = "Noto'gri pin yoki qurilma id"

      if (err instanceof Error) {
        message = err.message
      }

      return res.status(404).json({ message })
    }
  }
}
