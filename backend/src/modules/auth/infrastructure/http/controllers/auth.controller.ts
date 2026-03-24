// infrastructure/http/controllers/user.controller.ts

import type { LoginUserService } from '@/modules/auth/application/service/login-user.service'
import type { RegisterUserService } from '@/modules/auth/application/service/register-user.service'

import type { NextFunction, Request, Response } from 'express'
import { loginSchema } from '../validator/login.validator'
import { registerCredentialsSchema } from '../validator/register.credentials.validator'

export class AuthController {
  constructor(
    private readonly loginService: LoginUserService,
    private readonly registerService: RegisterUserService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, pin, deviceId, deviceName, deviceType, os, browser, ipAddress } =
        registerCredentialsSchema.parse(req.body)

      const registrationData = {
        name,
        phone,
        pin,
        deviceId,
        deviceName,
        deviceType,
        os,
        browser,
        ipAddress,
      }

      // Call the service to create user and generate tokens
      const result = await this.registerService.execute(registrationData)

      // Set the access and refresh tokens in cookies
      res
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000, // 15 minutes
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })
        .cookie('deviceToken', result.deviceToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })

      res.status(201).end()
    } catch (err) {
      return next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId, pin, phone, deviceName, deviceType, os, browser, ipAddress, deviceToken } =
        loginSchema.parse(req.body)

      const deviceInfo = {
        deviceName,
        deviceType,
        os,
        browser,
        ipAddress,
        deviceToken,
      }

      // Ensure that deviceInfo is passed as an object
      const result = await this.loginService.login(deviceId, pin, phone, deviceInfo)

      // Set the access and refresh tokens in cookies
      res
        .cookie('accessToken', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000, // 15 minutes
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })
        .cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })

      // Conditionally set deviceToken cookie only if it exists
      if (result.deviceToken) {
        res.cookie('deviceToken', result.deviceToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
          path: '/',
        })
      }

      // Respond with a 201 status code to indicate successful login
      res.status(201).end()
    } catch (err) {
      // Pass errors to the next middleware (error handler)
      next(err)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is missing' })
        return
      }

      const result = await this.loginService.refreshToken(refreshToken)

      // Set the new access token in cookies
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
      })

      console.log('New access token generated:', result.accessToken) // Debugging log

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}
