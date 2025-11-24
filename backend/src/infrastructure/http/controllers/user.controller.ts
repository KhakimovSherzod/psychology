// infrastructure/http/controllers/user.controller.ts

import type { NextFunction, Request, Response } from 'express'
import { RegisterUserService } from '../../../application/services/register-user.service'
import { UserService } from '../../../application/services/user.service'
import { generateAccessToken, generateRefreshToken } from '../../../lib/generate-jwt'
import { PrismaUserRepository } from '../../prisma/repositories/user.prisma.repository'
import { LoginUserService } from '../../../application/services/login-user.service'

export class UserController {
  private userRepo = new PrismaUserRepository()
  private registerService = new RegisterUserService(this.userRepo)
  private userService = new UserService(this.userRepo)
  private loginService = new LoginUserService(this.userRepo)
  // Register a new user
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

 async login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, pin, deviceId } = req.body

    if (!pin) {
      return res.status(400).json({ message: 'PIN taqdim etilmagan' })
    }

    if (!phone && !deviceId) {
      return res.status(400).json({ message: 'Telefon yoki Qurilma ID taqdim etilmagan' })
    }

    const user = await this.loginService.login( deviceId, pin, phone)

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

    res.status(200).json({
      message: 'User logged in successfully',
    })
  } catch (err) {
    next(err)
  }
}


  // Get user by UUID
  async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    console.log('controller, me functions is getting current user')
    const user = await this.userService.getUserByUUID(req.user.sub)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({
      user,
      message: 'Successfully fetched user',
    })
  }

  // Update user details
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub // 'sub' should be the UUID of the user
      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      const { name, phone, pin, profileImage } = req.body // Get the data to update from request body
      if (!name && !phone && !pin && !profileImage) {
        return res.status(400).json({ message: 'No data provided to update' })
      }

      // Call service to update the user
      const result = await this.userService.updateUser(uuid, name, phone, pin, profileImage)

      // If the result contains an error status, return it to the client
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message })
      }
      console.log('user controller status', result.status, 'and message', result.message)
      // If the update is successful, return the success message
      return res.status(result.status).json({
        message: result.message,
      })
    } catch (err: any) {
      // If error details are available, propagate them; otherwise, return 500
      console.error('Error occurred while updating user:', err)
      if (err?.status && err?.message) {
        return res.status(err.status).json({ message: err.message })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub // 'sub' should be the UUID of the user
      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      // Call service to delete the user
      const result = await this.userService.deleteUser(uuid)

      // If the result contains an error status, return it to the client
      if (result.status !== '200') {
        return res.status(parseInt(result.status)).json({ message: result.message })
      }

      // If the deletion is successful, return success message
      return res.status(200).json({
        message: result.message,
      })
    } catch (err: any) {
      // If error details are available, propagate them; otherwise, return 500
      console.error('Error occurred while deleting user:', err)
      if (err?.status && err?.message) {
        return res.status(err.status).json({ message: err.message })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async verifyPin(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub
      const { pin } = req.body

      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      if (!pin) {
        return res.status(400).json({ message: 'PIN not provided' })
      }

      const isValid = await this.userService.verifyPin(uuid, pin)

      return res.status(200).json({ isValid })
    } catch (err: any) {
      console.error('Error occurred while verifying PIN:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async changePin(req: Request, res: Response): Promise<Response> {
    try {
      const uuid = req.user?.sub
      const { newPin } = req.body

      if (!uuid) {
        return res.status(400).json({ message: 'User UUID not found' })
      }

      if (!newPin) {
        return res.status(400).json({ message: 'New PIN not provided' })
      }

      const result = await this.userService.changePin(uuid, newPin)

      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message })
      }

      return res.status(200).json({ message: result.message })
    } catch (err: any) {
      console.error('Error occurred while changing PIN:', err)
      if (err?.status && err?.message) {
        return res.status(err.status).json({ message: err.message })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
