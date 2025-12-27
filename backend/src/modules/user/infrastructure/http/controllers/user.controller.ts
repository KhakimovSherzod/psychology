// infrastructure/http/controllers/user.controller.ts

import { UserService } from '@/modules/user/application/services/user.service'
import type { NextFunction, Request, Response } from 'express'
import { PrismaUserRepository } from '../../prisma/repositories/user.prisma.repository'
import { logger } from '@/utils/logger'

export class UserController {
  private userRepo = new PrismaUserRepository()
  private userService = new UserService(this.userRepo)

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

 async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('GET all users request received in controller in getAllUsers function')

    try {
      const users = await this.userService.getAllUsers()
      res.status(200).json({ users })
      logger.info('GET /users successful, returned %d users', users.length)
    } catch (err) {
      logger.error('GET /users failed: %o', err)
      next(err) 
    }
  }
  async getUserByUuid(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { uuid } = req.params
    logger.info('GET user by UUID request received in controller in getUserByUuid function for UUID: %s', uuid)
    if(!uuid){
      res.status(400).json({ message: 'UUID parameter is required' })
      logger.warn('GET /users/%s failed: UUID parameter is missing', uuid)
      return
    }
    try {
      const user = await this.userService.getUserByUUID(uuid)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
        logger.warn('GET /users/%s failed: User not found', uuid)
        return
      }
      res.status(200).json({ user })
      logger.info('GET /users/%s successful', uuid)
    } catch (err) {
      logger.error('GET /users/%s failed: %o', uuid, err)
      next(err) 
    }
  }
}
