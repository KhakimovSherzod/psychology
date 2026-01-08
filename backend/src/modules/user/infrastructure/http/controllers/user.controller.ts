// infrastructure/http/controllers/user.controller.ts

import { UserService } from '@/modules/user/application/services/user.service'
import { logger } from '@/utils/logger'
import type { NextFunction, Request, Response } from 'express'
import { PrismaUserRepository } from '../../prisma/repositories/user.prisma.repository'
import { CreateUserSchema } from '../../validator/create.user.validator'
import { updateUserRoleSchema } from '../../validator/role.validator'
import { updateUserStatusSchema } from '../../validator/status.validator'
import { updateUserCredentialsSchema, uuidParamSchema } from '../../validator/update.user.validator'

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

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.user?.sub)

      const updateObject = updateUserCredentialsSchema.parse(req.body) // Get the data to update from request body

      const filteredObjects = Object.fromEntries(
        Object.entries(updateObject).filter(([_, v]) => v !== undefined)
      )
      logger.info(
        'update user credentials: %o, in user controller update function',
        filteredObjects
      )

      // Call service to update the user
      const result = await this.userService.updateUser(uuid, filteredObjects)

      // If the update is successful, return the success message
      res
        .status(200)
        .json({
          result,
        })
        .send()
    } catch (err: any) {
      // If error details are available, propagate them; otherwise, return 500
      logger.error('Error occurred while updating user:', err)
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.user?.sub)

      // Call service to delete the user
      const result = await this.userService.deleteUser(uuid)

      logger.info('User with UUID %s deleted successfully', uuid)

      res
        .status(200)
        .json({
          result,
        })
        .send()
    } catch (err) {
      logger.error('Error occurred while deleting user:', err)
      next(err)
    }
  }
  // Admin: Get all users
  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
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
    logger.info(
      'GET user by UUID request received in controller in getUserByUuid function for UUID: %s',
      uuid
    )
    if (!uuid) {
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

  // Admin: Update user status by UUID
  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { uuid, status } = updateUserStatusSchema.parse({
      uuid: req.params.uuid,
      status: req.body.status,
    })
    logger.info(
      'PATCH user status request received in controller in updateUserStatus function for UUID: %s to STATUS: %s',
      uuid,
      status
    )

    try {
      await this.userService.updateUserStatus(uuid, status)
      res.status(200).send()
      logger.info('PATCH /users/%s/status successful to STATUS: %s', uuid, status)
    } catch (err) {
      logger.error('PATCH /users/%s/status failed: %o', uuid, err)
      next(err)
    }
  }

  // Admin: Update user role by UUID
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { uuid, role } = updateUserRoleSchema.parse({
      uuid: req.params.uuid,
      role: req.body.role,
    })
    logger.info(
      'PATCH user role request received in controller in updateUserRole function for UUID: %s to ROLE: %s',
      uuid,
      role
    )

    try {
      await this.userService.updateUserRole(uuid, role)
      res.status(200).send()
      logger.info('PATCH /users/%s/role successful to ROLE: %s', uuid, role)
    } catch (err) {
      logger.error('PATCH /users/%s/role failed: %o', uuid, err)
      next(err)
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, phone, pin, role } = CreateUserSchema.parse(req.body)
    logger.info(
      'create User function in user controller got credentials name:%s, phone: %s, pin',
      name,
      phone
    )

    try {
      const createdUser = await this.userService.createUser(name, phone, pin, role)
      logger.info(
        'created new user in createUser function in user controller with this credentials: %o',
        createdUser
      )
      res.status(200).json(createdUser)
    } catch (err) {
      logger.error('in user controller create new user failed: %o', err)
      next(err)
    }
  }
}
