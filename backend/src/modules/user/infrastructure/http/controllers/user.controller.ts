import { CreateUserByAdminService } from './../../../application/services/createUserAdmin.service'

import type { UpdateUserService } from '@/modules/user/application/services/updateUser.service'
import type { UserService } from '@/modules/user/application/services/user.service'
import { logger } from '@/utils/logger'
import type { NextFunction, Request, Response } from 'express'
import { CreateUserSchema } from '../../validator/create.user.validator'
import { updateUserRoleSchema } from '../../validator/role.validator'
import { updateUserStatusSchema } from '../../validator/status.validator'
import { updateUserCredentialsSchema } from '../../validator/update.user.validator'
import { uuidParamSchema } from '@/shared/validator/uuid.validator'


export class UserController {
  constructor(
    private userService: UserService,
    private createUserByAdminService: CreateUserByAdminService,
    private updateUserService: UpdateUserService
  ) {}

  // Get user by UUID
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserByUUID(req.user.sub)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.user.sub)

      const updateObject = updateUserCredentialsSchema.parse(req.body) // Get the data to update from request body

      const filteredObjects = Object.fromEntries(
        Object.entries(updateObject).filter(([_, v]) => v !== undefined)
      )

      // Call service to update the user
      await this.updateUserService.execute(uuid, filteredObjects)

      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.user.sub)

      await this.userService.deleteUser(uuid)

      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
  // Admin: Get all users
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const includeDeleted = req.query.includeDeleted === 'true'
    try {
      const users = await this.userService.getAllUsers(includeDeleted)
      res.status(200).json({ users })
    } catch (err) {
      next(err)
    }
  }
  async getUserByUuid(req: Request, res: Response, next: NextFunction): Promise<void> {
    const uuid = uuidParamSchema.parse(req.params)

    try {
      const user = await this.userService.getUserByUUID(uuid)

      res.status(200).json({ user })
    } catch (err) {
      next(err)
    }
  }

  // Admin: Update user status by UUID
  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { uuid, status } = updateUserStatusSchema.parse({
      uuid: req.params.uuid,
      status: req.body.status,
    })
    console.log('Parsed UUID and status:', uuid, status)
    try {
      await this.updateUserService.updateUserStatus(uuid, status)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }

  // Admin: Update user role by UUID
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { uuid, role } = updateUserRoleSchema.parse({
      uuid: req.params.uuid,
      role: req.body.role,
    })
    try {
      await this.updateUserService.updateUserRole(uuid, role)
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, phone, pin } = CreateUserSchema.parse(req.body)

    try {
      const user = await this.createUserByAdminService.createUser(name, phone, pin)

      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }
  async restoreUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const uuid = uuidParamSchema.parse(req.params.uuid)

    try {
      await this.userService.restoreUser(uuid)
      res.status(200).send()
    } catch (err) {
      //TODO error middleware
      next(err)
    }
  }
  //admin route deletion
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.params.uuid)

      await this.userService.deleteUser(uuid)

      res.status(200).end()
    } catch (err) {
      logger.error('Error occurred while deleting user:', err)
      next(err)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uuid = uuidParamSchema.parse(req.params.uuid)

      const updateObject = updateUserCredentialsSchema.parse(req.body) // Get the data to update from request body

      const filteredObjects = Object.fromEntries(
        Object.entries(updateObject).filter(([_, v]) => v !== undefined)
      )

      const result = await this.updateUserService.execute(uuid, filteredObjects)

      res
        .status(200)
        .json({
          result,
        })
        .send()
    } catch (err) {
      next(err)
    }
  }
}
